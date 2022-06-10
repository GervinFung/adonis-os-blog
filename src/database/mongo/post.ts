import { Collection, ObjectId, Document } from 'mongodb';
import {
    ChangeStringIdToMongoId,
    InsertPost,
    UpdatePostExcludeTimeUpdated,
    PublishedPosts,
    UnpublishedPosts,
    UpdatePost,
    DeletedPost,
    UnpublishedPost,
    PublishedPost,
    DeletedPosts,
    PostsQueryOption,
} from '../../common/type/post';
import nullableToUndefinedPropsParser from '../../parser/type';
import { postsPerPage } from '../../util/const';
import { assertUpdateOneComplete } from './util';

type ShowManyOptions = Readonly<{
    skip: number;
}>;

const postCollection = (getPost: () => Collection<Document>) => {
    const postQuery = (option: PostsQueryOption) => {
        switch (option) {
            case 'unpublished':
                return {
                    timeDeleted: null,
                    timePublished: null,
                };
            case 'published':
                return {
                    timeDeleted: null,
                    //ref: https://www.mongodb.com/docs/manual/reference/operator/query/
                    timePublished: {
                        $ne: null,
                    },
                };
            case 'deleted':
                return {
                    timePublished: null,
                    timeDeleted: {
                        $ne: null,
                    },
                };
        }
    };

    const totalPosts = async (queryOption: PostsQueryOption): Promise<number> =>
        (await getPost().find(postQuery(queryOption)).toArray()).length;

    const nullToUndefinedParser = nullableToUndefinedPropsParser();

    const showOne = async <T = DeletedPost | PublishedPost | UnpublishedPost>(
        id: ObjectId,
        type: PostsQueryOption
    ) => {
        const timeFieldRequired =
            type === 'published'
                ? 'timePublished'
                : type === 'unpublished'
                ? 'timeCreated'
                : 'timeDeleted';
        const post = await getPost().findOne<T>(
            {
                _id: id,
                ...postQuery(type),
            },
            {
                projection: {
                    _id: 0,
                    title: 1,
                    description: 1,
                    content: 1,
                    [timeFieldRequired]: 1,
                },
            }
        );
        if (post) {
            return nullToUndefinedParser.parseObject(post) as T;
        }
        if (
            !(await getPost().findOne<T>(
                {
                    _id: id,
                },
                {
                    projection: {
                        _id: 1,
                    },
                }
            ))
        ) {
            throw new Error(
                `Cannot query for post with invalid id of ${id.toHexString()}`
            );
        }
        return undefined;
    };

    const showMany = async <
        T extends UnpublishedPosts | PublishedPosts | DeletedPosts
    >(
        { skip }: ShowManyOptions,
        type: PostsQueryOption
    ) => {
        const timeFieldRequired =
            type === 'published'
                ? 'timePublished'
                : type === 'unpublished'
                ? 'timeCreated'
                : 'timeDeleted';
        return (
            await getPost()
                .find<ChangeStringIdToMongoId<T[0]>>(postQuery(type), {
                    projection: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        [timeFieldRequired]: 1,
                    },
                })
                .limit(postsPerPage)
                .skip(skip * postsPerPage)
                .sort({
                    [timeFieldRequired]: -1,
                })
                .toArray()
        ).map(({ _id, ...props }) => ({
            ...props,
            id: _id.toHexString(),
        }));
    };

    return {
        // testing purpose only
        clear: async () => await getPost().deleteMany({}),
        bulkInsert: async (
            posts: ReadonlyArray<InsertPost>
        ): Promise<
            Readonly<{
                [key: number]: ObjectId;
            }>
        > => {
            const { acknowledged, insertedIds, insertedCount } =
                await getPost().insertMany(Array.from(posts));
            if (!(acknowledged && insertedCount === posts.length)) {
                throw new Error(
                    `Faulty insertion, acknowledged: ${acknowledged}, insertedCount: ${insertedCount} and length: ${posts.length}`
                );
            }
            return insertedIds;
        },
        // general use
        totalUnpublishedPosts: () => totalPosts('unpublished'),
        totalPublishedPosts: () => totalPosts('published'),
        totalDeletedPosts: () => totalPosts('deleted'),
        showManyUnpublished: (options: ShowManyOptions) =>
            showMany<UnpublishedPosts>(options, 'unpublished'),
        showManyPublished: (options: ShowManyOptions) =>
            showMany<PublishedPosts>(options, 'published'),
        showManyDeleted: (options: ShowManyOptions) =>
            showMany<DeletedPosts>(options, 'deleted'),
        showDeletedOne: (id: ObjectId) => showOne<DeletedPost>(id, 'deleted'),
        showUnpublishedOne: (id: ObjectId) =>
            showOne<UnpublishedPost>(id, 'unpublished'),
        showPublishedOne: (id: ObjectId) =>
            showOne<PublishedPost>(id, 'published'),
        insertOne: async (post: InsertPost): Promise<ObjectId> => {
            const { acknowledged, insertedId } = await getPost().insertOne({
                ...post,
                timeDeleted: undefined,
                timePublished: undefined,
            });
            if (!acknowledged) {
                throw new Error(`Insert post ${post} failed`);
            }
            return insertedId;
        },
        deleteOne: async (id: ObjectId): Promise<ObjectId> =>
            assertUpdateOneComplete(
                await getPost().updateOne(
                    {
                        _id: id,
                        timeDeleted: undefined,
                    },
                    {
                        $set: {
                            timeDeleted: new Date(),
                            timeUpdated: new Date(),
                            timePublished: undefined,
                        },
                    }
                ),
                {
                    debugInfo: id,
                    infoToReturn: id,
                }
            ),
        restoreOne: async (id: ObjectId) =>
            assertUpdateOneComplete(
                await getPost().updateOne(
                    {
                        _id: id,
                        timeDeleted: {
                            $ne: undefined,
                        },
                    },
                    {
                        $set: {
                            timeDeleted: undefined,
                            timeUpdated: new Date(),
                        },
                    }
                ),
                {
                    debugInfo: id,
                    infoToReturn: id,
                }
            ),
        updateOne: async (
            post: UpdatePostExcludeTimeUpdated &
                Readonly<{
                    timeUpdated: UpdatePost['timeUpdated'];
                }>
        ): Promise<ObjectId> =>
            assertUpdateOneComplete(
                await getPost().updateOne(
                    {
                        _id: post.id,
                        timeDeleted: undefined,
                    },
                    {
                        $set: {
                            ...post,
                        },
                    }
                ),
                {
                    debugInfo: post.id,
                    infoToReturn: post.id,
                }
            ),
        unpublishOne: async (id: ObjectId) =>
            assertUpdateOneComplete(
                await getPost().updateOne(
                    {
                        _id: id,
                        timeDeleted: undefined,
                        timePublished: {
                            $ne: undefined,
                        },
                    },
                    {
                        $set: {
                            timePublished: undefined,
                            timeUpdated: new Date(),
                        },
                    }
                ),
                {
                    debugInfo: id,
                    infoToReturn: id,
                }
            ),
        publishOne: async (id: ObjectId) =>
            assertUpdateOneComplete(
                await getPost().updateOne(
                    {
                        _id: id,
                        timeDeleted: undefined,
                        timePublished: undefined,
                    },
                    {
                        $set: {
                            timePublished: new Date(),
                            timeUpdated: new Date(),
                        },
                    }
                ),
                {
                    debugInfo: id,
                    infoToReturn: id,
                }
            ),
    } as const;
};

export default postCollection;

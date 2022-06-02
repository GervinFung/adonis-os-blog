import { Collection, ObjectId, Document } from 'mongodb';
import {
    AllPosts,
    ChangeHexIdToMongoId,
    ChangeIdToMongoId,
    InsertPost,
    QueryUpdatePost,
    ReadPost,
    ShowPosts,
    UpdatePost,
} from '../../common/type/post';
import { postsPerPage } from '../../util/const';

const postCollection = (getPost: () => Collection<Document>) => {
    const showMany = async ({
        skip,
        isIncludeUnpublished,
    }: Readonly<{
        skip: number;
        isIncludeUnpublished: boolean;
    }>): Promise<ShowPosts> =>
        (
            await getPost()
                .find<ChangeHexIdToMongoId<ShowPosts[0]>>(
                    isIncludeUnpublished
                        ? {}
                        : {
                              //ref: https://www.mongodb.com/docs/manual/reference/operator/query/
                              timePublished: {
                                  $ne: undefined,
                              },
                          },
                    {
                        projection: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            timePublished: 1,
                        },
                    }
                )
                .limit(postsPerPage)
                .skip(skip * postsPerPage)
                .sort({
                    timePublished: -1,
                })
                .toArray()
        ).map(({ _id, ...props }) => ({ id: _id.toHexString(), ...props }));

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
        totalPosts: async (): Promise<number> =>
            (
                await getPost()
                    .find({
                        timePublished: {
                            $ne: undefined,
                        },
                    })
                    .toArray()
            ).length,
        showAllPosts: async (): Promise<AllPosts> =>
            (
                await getPost()
                    .find<ChangeIdToMongoId<AllPosts[0]>>(
                        {},
                        {
                            projection: {
                                _id: 1,
                                title: 1,
                                description: 1,
                                timePublished: 1,
                                timeUpdated: 1,
                                timeCreated: 1,
                            },
                        }
                    )
                    .sort({
                        timePublished: -1,
                    })
                    .toArray()
            ).map(({ _id, ...props }) => ({ id: _id, ...props })),
        showManyPublishedOnly: async ({
            skip,
        }: Readonly<{
            skip: number;
        }>): Promise<ShowPosts> =>
            await showMany({ skip, isIncludeUnpublished: false }),
        showManyWithUnpublished: async ({
            skip,
        }: Readonly<{
            skip: number;
        }>): Promise<ShowPosts> =>
            await showMany({ skip, isIncludeUnpublished: true }),
        showOne: async (id: ObjectId): Promise<ReadPost> => {
            const post = await getPost().findOne<ReadPost>(
                {
                    _id: id,
                    timePublished: {
                        $ne: undefined,
                    },
                },
                {
                    projection: {
                        _id: 0,
                        title: 1,
                        description: 1,
                        content: 1,
                        timePublished: 1,
                    },
                }
            );
            if (!post) {
                throw new Error(
                    `Cannot find post with id of ${id.toHexString()}`
                );
            }
            return post;
        },
        insertOne: async (post: InsertPost): Promise<ObjectId> => {
            const { acknowledged, insertedId } = await getPost().insertOne(
                post
            );
            if (!acknowledged) {
                throw new Error(`Insert post failed`);
            }
            return insertedId;
        },
        deleteOne: async (id: ObjectId): Promise<ObjectId> => {
            const {
                acknowledged,
                matchedCount,
                modifiedCount,
                upsertedId,
                upsertedCount,
            } = await getPost().updateOne(
                { _id: id },
                {
                    $set: {
                        timePublished: undefined,
                    },
                }
            );
            if (!acknowledged) {
                throw new Error(`Delete post failed for ${id}`);
            }
            const isOnePostSoftDeleted =
                matchedCount === modifiedCount &&
                modifiedCount === 1 &&
                upsertedCount === 0 &&
                upsertedId === null;
            if (!isOnePostSoftDeleted) {
                throw new Error(`There are duplicated id for ${id}`);
            }
            return id;
        },
        updateOne: async (
            id: ObjectId,
            post: UpdatePost
        ): Promise<ObjectId> => {
            const {
                acknowledged,
                matchedCount,
                modifiedCount,
                upsertedId,
                upsertedCount,
            } = await getPost().updateOne(
                { _id: id },
                {
                    $set: {
                        ...post,
                    },
                }
            );
            if (!acknowledged) {
                throw new Error(`Update post failed for ${id}`);
            }
            const isOnePostSoftDeleted =
                matchedCount === modifiedCount &&
                modifiedCount === 1 &&
                upsertedCount === 0 &&
                upsertedId === null;
            if (!isOnePostSoftDeleted) {
                throw new Error(`There are duplicated id for ${id}`);
            }
            return id;
        },
        publishOne: async (id: ObjectId) => {
            const {
                acknowledged,
                matchedCount,
                modifiedCount,
                upsertedId,
                upsertedCount,
            } = await getPost().updateOne(
                { _id: id },
                {
                    $set: {
                        timePublished: new Date(),
                        timeUpdated: new Date(),
                    },
                }
            );
            if (!acknowledged) {
                throw new Error(`Publish post failed for ${id}`);
            }
            const isOnePostSoftDeleted =
                matchedCount === modifiedCount &&
                modifiedCount === 1 &&
                upsertedCount === 0 &&
                upsertedId === null;
            if (!isOnePostSoftDeleted) {
                throw new Error(`There are duplicated id for ${id}`);
            }
            return id;
        },
        showPostToBeUpdated: async (id: ObjectId): Promise<QueryUpdatePost> => {
            const post = await getPost().findOne<
                ChangeIdToMongoId<QueryUpdatePost>
            >(
                {
                    _id: id,
                },
                {
                    projection: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        content: 1,
                        timePublished: 1,
                    },
                }
            );
            if (!post) {
                throw new Error(
                    `Cannot find post with id of ${id.toHexString()}`
                );
            }
            const { _id, ...props } = post;
            return {
                ...props,
                id: _id,
            };
        },
    } as const;
};

export default postCollection;

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
import { assertUpdateOneComplete } from './util';

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
                throw new Error(`Insert post ${post} failed`);
            }
            return insertedId;
        },
        deleteOne: async (id: ObjectId): Promise<ObjectId> =>
            assertUpdateOneComplete(
                await getPost().updateOne(
                    { _id: id },
                    {
                        $set: {
                            timePublished: undefined,
                        },
                    }
                ),
                {
                    debugInfo: id,
                    infoToReturn: id,
                }
            ),
        updateOne: async (id: ObjectId, post: UpdatePost): Promise<ObjectId> =>
            assertUpdateOneComplete(
                await getPost().updateOne(
                    { _id: id },
                    {
                        $set: {
                            ...post,
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
                    { _id: id },
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

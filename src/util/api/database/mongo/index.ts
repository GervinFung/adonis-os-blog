import { MongoClient, ObjectId } from 'mongodb';
import {
    AllPosts,
    ChangeHexIdToMongoId,
    ChangeIdToMongoId,
    InsertPost,
    QueryUpdatePost,
    ReadPost,
    ShowPosts,
    UpdatePost,
} from '../../../../common/type/post';
import { postsPerPage } from '../../../const';
import mongodbConfig from './config';

const mongodb = (async () => {
    const config = mongodbConfig();
    const client = (() => {
        const createURL = ({
            srv,
            port,
        }: Readonly<{
            srv: string | undefined;
            port: string | undefined;
        }>) => {
            if (srv) {
                return `mongodb${srv}://${user}:${password}@${address}/${dbName}?authSource=admin&retryWrites=true&w=majority`;
            }
            if (port) {
                return `mongodb://${user}:${password}@${address}:${port}/${dbName}?authSource=admin&retryWrites=true&w=majority`;
            }
            throw new Error('Port or SRV are not defined');
        };
        const {
            auth: { user, password },
            dbName,
            port,
            address,
            srv,
        } = config;
        return new MongoClient(createURL({ srv, port }));
    })();

    await client.connect();

    const {
        dbName,
        collections: { post },
    } = config;
    const database = client.db(dbName);

    const getPost = () => database.collection(post);

    return {
        // testing purpose only
        clearCollections: async () => await getPost().deleteMany({}),
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
        close: async () => await client.close(),
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
        showPosts: async ({
            skip,
        }: Readonly<{
            skip: number;
        }>): Promise<ShowPosts> =>
            (
                await getPost()
                    .find<ChangeHexIdToMongoId<ShowPosts[0]>>(
                        {
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
            ).map(({ _id, ...props }) => ({ id: _id.toHexString(), ...props })),
        showPost: async (id: ObjectId): Promise<ReadPost> => {
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
        insertPost: async (post: InsertPost): Promise<ObjectId> => {
            const { acknowledged, insertedId } = await getPost().insertOne(
                post
            );
            if (!acknowledged) {
                throw new Error(`Insert post failed`);
            }
            return insertedId;
        },
        deletePost: async (id: ObjectId): Promise<ObjectId> => {
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
        updatePost: async (
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
        publishPost: async (id: ObjectId) => {
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
    };
})();

export default mongodb;

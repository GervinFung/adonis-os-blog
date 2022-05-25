import { InsertOneResult, MongoClient, ObjectId } from 'mongodb';
import {
    ChangeHexIdToMongoId,
    InsertPost,
    ReadPost,
    ShowPosts,
} from '../../../../common/type';
import { postsPerPage } from '../../../const';
import mongodbConfig from './config';

const mongodb = (async () => {
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
        } = mongodbConfig;
        return new MongoClient(createURL({ srv, port }));
    })();

    await client.connect();

    const {
        dbName,
        collections: { post },
    } = mongodbConfig;
    const database = client.db(dbName);

    const getPost = () => database.collection(post);

    return {
        // testing purpose only
        close: async () => await client.close(),
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
        totalPosts: async () => await getPost().estimatedDocumentCount(),
        showPosts: async ({
            skip,
        }: Readonly<{
            skip: number;
        }>): Promise<ShowPosts> =>
            (
                await getPost()
                    .find<ChangeHexIdToMongoId<ShowPosts[0]>>(
                        {},
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
                    .toArray()
            ).map(({ _id, ...props }) => ({ id: _id.toHexString(), ...props })),
        showPost: async (id: ObjectId): Promise<ReadPost> => {
            const post = await getPost().findOne<ReadPost>(
                { _id: { $eq: id } },
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
        insertPost: async (
            post: InsertPost
        ): Promise<Readonly<InsertOneResult<Document>>> =>
            await getPost().insertOne(post),
    };
})();

export default mongodb;

import { MongoClient } from 'mongodb';
import mongodbConfig from './config';
import authRecordCollection from './auth-record';
import postCollection from './post';

const promisifyMongoDb = (async () => {
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
        collections: { post, authRecord },
    } = config;

    const database = client.db(dbName);

    return {
        postCollection: postCollection(() => database.collection(post)),
        authRecordCollection: authRecordCollection(() =>
            database.collection(authRecord)
        ),
        close: () => client.close(),
    } as const;
})();

export default promisifyMongoDb;

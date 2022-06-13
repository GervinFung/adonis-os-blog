import dotenv from 'dotenv';
import { parseAsEnv } from 'esbuild-env-parsing';

const mongodbConfig = () => {
    dotenv.config({
        path: `${process.cwd()}/.env${
            process.env.NODE_ENV === 'test' ? '.test' : ''
        }`,
    });

    return {
        port: process.env.MONGO_PORT,
        srv: process.env.MONGO_SRV,
        dbName: parseAsEnv({
            env: process.env.MONGO_DB,
            name: 'MONGO_DB',
        }),
        address: parseAsEnv({
            env: process.env.MONGO_ADDRESS,
            name: 'MONGO_ADDRESS',
        }),
        collections: {
            post: parseAsEnv({
                env: process.env.MONGO_COLLECTION_POST,
                name: 'MONGO_COLLECTION_POST',
            }),
            authRecord: parseAsEnv({
                env: process.env.MONGO_COLLECTION_AUTH_RECORD,
                name: 'MONGO_COLLECTION_AUTH_RECORD',
            }),
        },
        auth: {
            user: parseAsEnv({
                env: process.env.MONGO_USER,
                name: 'MONGO_USER',
            }),
            password: parseAsEnv({
                env: process.env.MONGO_PASSWORD,
                name: 'MONGO_PASSWORD',
            }),
        },
    } as const;
};

export default mongodbConfig;

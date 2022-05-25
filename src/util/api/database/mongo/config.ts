import dotenv from 'dotenv';
import { parseAsEnv } from 'esbuild-env-parsing';

const mongodbConfig = (() => {
    dotenv.config({
        path: `${process.cwd()}/.env${
            process.env.NODE_ENV === 'test' ? '.test' : ''
        }`,
    });

    return {
        dbName: parseAsEnv({
            env: process.env.MONGO_DB,
            name: 'MONGO_DB',
        }),
        address: parseAsEnv({
            env: process.env.MONGO_ADDRESS,
            name: 'MONGO_ADDRESS',
        }),
        port: process.env.MONGO_PORT,
        collections: {
            post: parseAsEnv({
                env: process.env.MONGO_COLLECTION_POST,
                name: 'MONGO_COLLECTION_POST',
            }),
        },
        srv: process.env.MONGO_SRV,
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
})();

export default mongodbConfig;

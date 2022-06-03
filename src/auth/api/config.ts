import { parseAsEnv } from 'esbuild-env-parsing';

const config = {
    type: parseAsEnv({
        env: process.env.FIREBASE_TYPE,
        name: 'FIREBASE_TYPE',
    }),
    projectId: parseAsEnv({
        env: process.env.FIREBASE_PROJECT_ID,
        name: 'FIREBASE_PROJECT_ID',
    }),
    privateKeyId: parseAsEnv({
        env: process.env.FIREBASE_KEY_ID,
        name: 'FIREBASE_KEY_ID',
    }),
    privateKey: parseAsEnv({
        env: process.env.FIREBASE_KEY,
        name: 'FIREBASE_KEY',
    }),
    clientEmail: parseAsEnv({
        env: process.env.FIREBASE_CLIENT_EMAIL,
        name: 'FIREBASE_CLIENT_EMAIL',
    }),
    clientId: parseAsEnv({
        env: process.env.FIREBASE_CLIENT_ID,
        name: 'FIREBASE_CLIENT_ID',
    }),
    authUri: parseAsEnv({
        env: process.env.FIREBASE_AUTH_URI,
        name: 'FIREBASE_AUTH_URI',
    }),
    tokenUri: parseAsEnv({
        env: process.env.FIREBASE_TOKEN_URI,
        name: 'FIREBASE_TOKEN_URI',
    }),
    authProviderX509CertUrl: parseAsEnv({
        env: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        name: 'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
    }),
    clientX509CertUrl: parseAsEnv({
        env: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        name: 'FIREBASE_CLIENT_X509_CERT_URL',
    }),
};

export default config;

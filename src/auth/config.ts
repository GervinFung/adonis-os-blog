import { initializeApp } from 'firebase/app';
import { parseAsEnv } from 'esbuild-env-parsing';

const app = initializeApp({
    apiKey: parseAsEnv({
        env: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        name: 'FIREBASE_API_KEY',
    }),
    authDomain: parseAsEnv({
        env: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        name: 'FIREBASE_AUTH_DOMAIN',
    }),
    projectId: parseAsEnv({
        env: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        name: 'FIREBASE_PROJECT_ID',
    }),
    storageBucket: parseAsEnv({
        env: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        name: 'FIREBASE_STORAGE_BUCKET',
    }),
    messagingSenderId: parseAsEnv({
        env: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        name: 'FIREBASE_MESSAGING_SENDER_ID',
    }),
    appId: parseAsEnv({
        env: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        name: 'FIREBASE_APP_ID',
    }),
    measurementId: parseAsEnv({
        env: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        name: 'FIREBASE_MEASUREMENT_ID',
    }),
});

export { app };

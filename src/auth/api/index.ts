import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import config from './config';

const auth = getAuth(
    admin.apps[0] ??
        initializeApp({
            credential: admin.credential.cert(config),
        })
);

export default auth;

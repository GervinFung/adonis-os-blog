import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
    Auth,
} from 'firebase/auth';
import adonisAxios from '../axios';
import { app } from './config';
import { api } from '../util/const';
import nullableToUndefinedPropsParser from '../parser/type';

const auth = (() => {
    const auth = getAuth();
    auth.languageCode = 'it';
    return auth;
})();

const createAdonisAuthAdmin = (auth: Auth) => {
    if (!app) {
        throw new Error('firebase app is not initialized');
    }
    return {
        signIn: async ({
            email,
            password,
        }: Readonly<{
            email: string;
            password: string;
        }>) => {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                await adonisAxios.post(api.admin.login, {
                    data: {
                        token: await userCredential.user.getIdToken(true),
                    },
                });
                return {
                    type: 'succeed',
                    name: userCredential.user.displayName,
                } as const;
            } catch (error: any) {
                return {
                    type: 'failed',
                    error,
                } as const;
            }
        },
        signOut: async (user: NonNullableAdonisAdmin) => {
            try {
                await adonisAxios.post(api.admin.logout, {
                    data: {
                        token: await user.getIdToken(true),
                    },
                });
                await auth.signOut();
                return {
                    type: 'succeed',
                } as const;
            } catch (error: any) {
                return {
                    type: 'failed',
                    error,
                } as const;
            }
        },
    } as const;
};

const adonisAdmin = createAdonisAuthAdmin(auth);

const onAdminStateChanged = (setAdmin: (admin: AdonisAdmin) => void) =>
    onAuthStateChanged(auth, (user) =>
        setAdmin(nullableToUndefinedPropsParser().parseValue(user))
    );

type AdonisAdmin = User | undefined;

type AuthResponse =
    | Readonly<{
          type: 'succeed';
          name: string | null;
          isFirstTime: boolean;
          error?: undefined;
      }>
    | Readonly<{
          type: 'failed';
          error: any;
          name?: undefined;
      }>;

type NonNullableAdonisAdmin = NonNullable<AdonisAdmin>;

export { adonisAdmin, onAdminStateChanged, auth };

export type { AdonisAdmin, NonNullableAdonisAdmin, AuthResponse };

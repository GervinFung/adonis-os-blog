import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
    Auth,
} from 'firebase/auth';
import adonisAxios from '../axios';
import parseNullableAsDefaultOrUndefined from '../parser/type/nullToUndefined';
import { app } from './config';
import { api } from '../util/const';

const auth = (() => {
    const auth = getAuth();
    auth.languageCode = 'it';
    return auth;
})();

const createAdonisAuthUser = (auth: Auth) => {
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
                    headers: {},
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
        signOut: async (user: NonNullableAdonisUser) => {
            try {
                await adonisAxios.post(api.admin.logout, {
                    data: {
                        token: await user.getIdToken(true),
                    },
                    headers: {},
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

const adonisUser = createAdonisAuthUser(auth);

const onUserStateChanged = (setUser: (user: AdonisUser) => void) =>
    onAuthStateChanged(auth, (user) =>
        setUser(parseNullableAsDefaultOrUndefined(user))
    );

type AdonisUser = User | undefined;

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

type NonNullableAdonisUser = NonNullable<AdonisUser>;

export { adonisUser, onUserStateChanged, auth };

export type { AdonisUser, NonNullableAdonisUser, AuthResponse };

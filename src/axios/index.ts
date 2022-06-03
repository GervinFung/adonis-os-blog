import axios, { Method } from 'axios';

const createInstance = (method: Method) =>
    axios.create({
        baseURL: '/api/',
        headers: {
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        withCredentials: true,
        method,
    });

const adonisAxios = {
    ...axios,
    get: (url: string) => createInstance('get').get(url),
    post: async (
        url: string,
        {
            headers,
            data,
            additionalConfig,
        }: Readonly<{
            data: any;
            additionalConfig?: any;
            headers?: Readonly<Record<string, any>>;
        }>
    ) =>
        await createInstance('post').post(url, data, {
            ...additionalConfig,
            headers,
        }),
} as const;

export default adonisAxios;

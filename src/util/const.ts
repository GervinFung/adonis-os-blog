import { UpdatePostStatus } from '../common/type/post';

const api = (() => {
    const postRoute = (
        route: 'update' | 'insert' | 'query' | UpdatePostStatus
    ) => `admin/post/${route}`;
    return {
        admin: {
            login: 'admin/login',
            logout: 'admin/logout',
            post: {
                update: postRoute('update'),
                restore: postRoute('restore'),
                insert: postRoute('insert'),
                publish: postRoute('publish'),
                delete: postRoute('delete'),
                unpublish: postRoute('unpublish'),
                query: postRoute('query'),
            },
        },
        post: {
            paginated: 'post/paginated',
            one: 'post/one',
        },
    } as const;
})();

const val = {
    post: {
        paginated: 'paginated',
        one: 'one',
    },
} as const;

const admin = {
    postQueryOptions: ['published', 'unpublished', 'deleted'],
    updatePostStatus: ['publish', 'unpublish', 'delete', 'restore'],
} as const;

const postsPerPage = 9;

export { api, postsPerPage, val, admin };

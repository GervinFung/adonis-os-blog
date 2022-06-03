const api = {
    admin: {
        login: 'admin/login',
        logout: 'admin/logout',
    },
    post: {
        paginated: 'post/paginated',
        one: 'post/one',
    },
} as const;

const val = {
    post: {
        paginated: 'paginated',
        one: 'one',
    },
} as const;

const postsPerPage = 9;

export { api, postsPerPage, val };

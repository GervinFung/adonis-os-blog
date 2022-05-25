import parseAsId from './post/id';
import parseAsPost from './post/post';
import parseAsPage from './posts/page';
import parseAsPosts from './posts/posts';
import parseAsTotalPosts from './posts/total';

const blogPropsParser = () =>
    ({
        posts: {
            parseAsPage,
            parseAsPosts,
            parseAsTotalPosts,
        },
        post: {
            parseAsPost,
            parseAsId,
        },
    } as const);

export default blogPropsParser;

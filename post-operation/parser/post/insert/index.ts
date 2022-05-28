import { parseAsReadonlyObject, parseAsString } from 'parse-dont-validate';
import { QueryInsertPost } from '../../../../src/common/type/post';

const parseAsInsertPost = (post: unknown): QueryInsertPost =>
    parseAsReadonlyObject(post, (post) => ({
        title: parseAsString(post.title).orElseThrowDefault('title'),
        description: parseAsString(post.description).orElseThrowDefault(
            'description'
        ),
        content: parseAsString(post.content).orElseThrowDefault('content'),
    })).orElseThrowDefault('post');

export default parseAsInsertPost;

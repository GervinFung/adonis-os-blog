import { ObjectId } from 'mongodb';
import { parseAsReadonlyObject } from 'parse-dont-validate';
import { QueryUpdatePost } from '../../../../src/common/type/post';
import parseAsId from '../../../../src/parser/blog/post/id';
import parseAsPost from '../../../../src/parser/blog/post/post';

const parseAsUpdatePost = (post: unknown): QueryUpdatePost =>
    parseAsReadonlyObject(post, (post) => ({
        ...parseAsPost(post),
        id: new ObjectId(parseAsId(post.id)),
    })).orElseThrowDefault('post');

export default parseAsUpdatePost;

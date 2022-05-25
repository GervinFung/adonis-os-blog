import { parseAsReadonlyObject, parseAsString } from 'parse-dont-validate';
import { ReadPost } from '../../../common/type';

const parseAsPost = (post: unknown): ReadPost =>
    parseAsReadonlyObject(post, (post) => ({
        title: parseAsString(post.title).orElseThrowDefault('title'),
        description: parseAsString(post.description).orElseThrowDefault(
            'description'
        ),
        content: parseAsString(post.content).orElseThrowDefault('content'),
        timePublished: new Date(
            parseAsString(post.timePublished).orElseThrowDefault(
                'timePublished'
            )
        ),
    })).orElseThrowDefault('post');

export default parseAsPost;

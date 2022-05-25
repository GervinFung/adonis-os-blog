import {
    parseAsReadonlyArray,
    parseAsReadonlyObject,
    parseAsString,
} from 'parse-dont-validate';
import { ShowPosts } from '../../../common/type';

const parseAsPosts = (posts: unknown): ShowPosts =>
    parseAsReadonlyArray(posts, (post) =>
        parseAsReadonlyObject(post, (post) => ({
            id: parseAsString(post.id).orElseThrowDefault('id'),
            title: parseAsString(post.title).orElseThrowDefault('title'),
            description: parseAsString(post.description).orElseThrowDefault(
                'description'
            ),
            timePublished: new Date(
                parseAsString(post.timePublished).orElseThrowDefault(
                    'timePublished'
                )
            ),
        })).orElseThrowDefault('post')
    ).orElseGetReadonlyEmptyArray();

export default parseAsPosts;

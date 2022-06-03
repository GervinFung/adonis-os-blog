import {
    parseAsNumber,
    parseAsReadonlyArray,
    parseAsReadonlyObject,
    parseAsString,
} from 'parse-dont-validate';
import { ReadPost, ShowPosts } from '../../common/type/post';
import { val } from '../../util/const';

const blogPropsParser = () =>
    ({
        [val.post.paginated]: {
            parseAsPage: (() => {
                const min = 1;
                return (page: unknown) =>
                    parseAsNumber(
                        parseInt(
                            parseAsString(page).orElseLazyGet(() => `${min}`)
                        )
                    )
                        .inRangeOf(min, Number.MAX_SAFE_INTEGER)
                        .orElseLazyGet(() => min);
            })(),
            parseAsTotalPosts: (() => {
                const min = 0;
                return (page: unknown) =>
                    parseAsNumber(page)
                        .inRangeOf(min, Number.MAX_SAFE_INTEGER)
                        .orElseLazyGet(() => min);
            })(),
            parseAsPosts: (posts: unknown): ShowPosts =>
                parseAsReadonlyArray(posts, (post) =>
                    parseAsReadonlyObject(post, (post) => ({
                        id: parseAsString(post.id).orElseThrowDefault('id'),
                        title: parseAsString(post.title).orElseThrowDefault(
                            'title'
                        ),
                        description: parseAsString(
                            post.description
                        ).orElseThrowDefault('description'),
                        timePublished: new Date(
                            parseAsString(
                                post.timePublished
                            ).orElseThrowDefault('timePublished')
                        ),
                    })).orElseThrowDefault('post')
                ).orElseGetReadonlyEmptyArray(),
        },
        [val.post.one]: {
            parseAsId: (id: unknown) =>
                parseAsString(id).orElseThrowDefault('id'),
            parseAsPost: (post: unknown): ReadPost =>
                parseAsReadonlyObject(post, (post) => ({
                    title: parseAsString(post.title).orElseThrowDefault(
                        'title'
                    ),
                    description: parseAsString(
                        post.description
                    ).orElseThrowDefault('description'),
                    content: parseAsString(post.content).orElseThrowDefault(
                        'content'
                    ),
                    timePublished: new Date(
                        parseAsString(post.timePublished).orElseThrowDefault(
                            'timePublished'
                        )
                    ),
                })).orElseThrowDefault('post'),
        },
    } as const);

export default blogPropsParser;

import {
    parseAsCustomType,
    parseAsNumber,
    parseAsReadonlyArray,
    parseAsReadonlyObject,
    parseAsString,
} from 'parse-dont-validate';
import {
    DeletedPost,
    DeletedPosts,
    InsertPostExcludeTimeCreated,
    PublishedPost,
    PublishedPosts,
    UnpublishedPost,
    UnpublishedPosts,
    UpdatePostExcludeTimeUpdatedStringId,
    UpdatePostStatus,
} from '../../common/type/post';
import { admin, val } from '../../util/const';

const blogPropsParser = () => {
    const parseAsTitle = (title: unknown) =>
        parseAsString(title).orElseThrowDefault('title');
    const parseAsDescription = (description: unknown) =>
        parseAsString(description).orElseThrowDefault('description');
    const parseAsContent = (content: unknown) =>
        parseAsString(content).orElseThrowDefault('content');

    const parseAsPostCommonProps = (post: unknown) =>
        parseAsReadonlyObject(post, (post) => ({
            title: parseAsTitle(post.title),
            description: parseAsDescription(post.description),
            content: parseAsContent(post.content),
        })).orElseThrowDefault('post');

    const parseAsPostOfPostsCommonProps = (post: unknown) =>
        parseAsReadonlyObject(post, (post) => ({
            id: parseAsId(post.id),
            title: parseAsTitle(post.title),
            description: parseAsDescription(post.description),
        })).orElseThrowDefault('post');

    const parseAsPublishedPost = (post: unknown): PublishedPost =>
        parseAsReadonlyObject(post, (post) => ({
            ...parseAsPostCommonProps(post),
            timePublished: parseAsTime(post.timePublished),
        })).orElseGetUndefined();

    const parseAsId = (id: unknown) =>
        parseAsString(id).orElseThrowDefault('id');

    const parseAsTime = (time: unknown) =>
        new Date(parseAsString(time).orElseThrowDefault('time'));

    return {
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
            parseAsPublishedPosts: (posts: unknown): PublishedPosts =>
                parseAsReadonlyArray(posts, (post) =>
                    parseAsReadonlyObject(post, (post) => ({
                        ...parseAsPostOfPostsCommonProps(post),
                        timePublished: parseAsTime(post.timePublished),
                    })).orElseThrowDefault('post')
                ).orElseGetReadonlyEmptyArray(),
            parseAsUnpublishedPosts: (posts: unknown): UnpublishedPosts =>
                parseAsReadonlyArray(posts, (post) =>
                    parseAsReadonlyObject(post, (post) => ({
                        ...parseAsPostOfPostsCommonProps(post),
                        timeCreated: parseAsTime(post.timeCreated),
                    })).orElseThrowDefault('post')
                ).orElseGetReadonlyEmptyArray(),
            parseAsDeletedPosts: (posts: unknown): DeletedPosts =>
                parseAsReadonlyArray(posts, (post) =>
                    parseAsReadonlyObject(post, (post) => ({
                        ...parseAsPostOfPostsCommonProps(post),
                        timeDeleted: parseAsTime(post.timeDeleted),
                    })).orElseThrowDefault('post')
                ).orElseGetReadonlyEmptyArray(),
        },
        [val.post.one]: {
            parseAsId,
            parseAsPublishedPost,
            parseAsUpdatePostStatus: (status: unknown): UpdatePostStatus =>
                parseAsCustomType<UpdatePostStatus>(status, (status) =>
                    admin.updatePostStatus.includes(status)
                ).orElseThrowDefault('status'),
            parseAsInsertPost: (post: unknown): InsertPostExcludeTimeCreated =>
                parseAsPostCommonProps(post),
            parseAsUnpublishedPost: (post: unknown): UnpublishedPost =>
                parseAsReadonlyObject(post, (post) => ({
                    ...parseAsPostCommonProps(post),
                    timeCreated: parseAsTime(post.timeCreated),
                })).orElseGetUndefined(),
            parseAsDeletedPost: (post: unknown): DeletedPost =>
                parseAsReadonlyObject(post, (post) => ({
                    ...parseAsPostCommonProps(post),
                    timeDeleted: parseAsTime(post.timeDeleted),
                })).orElseGetUndefined(),
            parseAsUpdatePost: (
                post: unknown
            ): UpdatePostExcludeTimeUpdatedStringId =>
                parseAsReadonlyObject(post, (post) => ({
                    ...parseAsPostOfPostsCommonProps(post),
                    timePublished: parseAsTime(post.timePublished),
                    content: parseAsContent(post.content),
                })).orElseThrowDefault('post'),
        },
    } as const;
};

export default blogPropsParser;

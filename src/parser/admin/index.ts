import { parseAsCustomType, parseAsString } from 'parse-dont-validate';
import { PostsQueryOption } from '../../common/type/post';
import { admin } from '../../util/const';

const adminPropsParser = () =>
    ({
        auth: {
            parseAsToken: (token: unknown) =>
                parseAsString(token).orElseThrowDefault('token'),
            parseAsNullableToken: (token: unknown) =>
                parseAsString(token).orElseGetUndefined(),
        },
        posts: {
            parseAsPostQueryOption: (option: unknown) =>
                parseAsCustomType<PostsQueryOption>(option, (option) =>
                    admin.postQueryOptions.includes(option)
                ).orElseThrowDefault('option'),
        },
    } as const);

export default adminPropsParser;

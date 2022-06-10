import * as React from 'react';
import { css } from '@emotion/css';
import { UserReadPublishedPost } from '../../../../../common/type/post';
import blogParser from '../../../../../parser/blog';
import { api } from '../../../../../util/const';
import adonisAxios from '../../../../../axios';
import { ToastError, ToastPromise } from '../../../toasify';
import { PostUnavailable, ReadonlyPost } from '../common/index';
import { parseAsString } from 'parse-dont-validate';

const UserReadPost = ({
    id,
    scrollbarStyle,
}: Readonly<{
    id: string;
    scrollbarStyle: string;
}>) => {
    const [state, setState] = React.useState({
        query: undefined as UserReadPublishedPost | undefined,
    });

    const { query } = state;

    React.useEffect(() => {
        const promise = new Promise<string>((res) =>
            adonisAxios
                .get(`${api.post.one}/${id}`)
                .then(({ data }) => {
                    setState((prev) => ({
                        ...prev,
                        query: {
                            ...prev.query,
                            post: blogParser().one.parseAsPublishedPost(
                                data.post
                            ),
                        },
                    }));
                    res('Completed');
                })
                .catch(ToastError)
        );
        ToastPromise({
            promise,
            pending: 'Querying post...',
            success: {
                render: ({ data }) =>
                    parseAsString(data).orElseThrowDefault('data'),
            },
            error: {
                render: () => ToastError(`Failed to query post ${id}`),
            },
        });
    }, []);

    return !query ? null : !query.post ? (
        <PostUnavailable type="published" />
    ) : (
        <ReadonlyPost
            post={query.post}
            blackColor={css`
                color: #121212;
            `}
            scrollbarStyle={scrollbarStyle}
        />
    );
};

export default UserReadPost;

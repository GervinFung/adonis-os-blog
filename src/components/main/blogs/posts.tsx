import * as React from 'react';
import { css } from '@emotion/css';
import Pagination from './paginate';
import { Item } from '../../../history';
import { api, postsPerPage } from '../../../util/const';
import { ShowPosts } from '../../../common/type/post';
import { blogParser } from '../../../parser';
import adonisAxios from '../../../axios';
import { ToastError } from '../toasify';

const Posts = ({
    setPostId,
    setPageHistory,
    shouldSetPageHistoryOnInitialLoad,
    getItem,
    scrollbarStyle,
}: Readonly<{
    setPostId: (id: string) => void;
    setPageHistory: (page: number) => void;
    shouldSetPageHistoryOnInitialLoad: boolean;
    getItem: () => 1 | Item;
    scrollbarStyle: string;
}>) => {
    const [state, setState] = React.useState({
        posts: [] as ShowPosts,
        totalPosts: 0,
    });

    const { posts, totalPosts } = state;

    const page = (() => {
        const item = getItem();
        if (item === 1) {
            return 1;
        }
        switch (item.type) {
            case 'one':
                throw new Error('item cannot be post');
            case 'paginated':
                return item.page;
        }
    })();

    React.useEffect(() => {
        if (shouldSetPageHistoryOnInitialLoad) {
            setPageHistory(page);
        }
    }, []);

    React.useEffect(() => {
        adonisAxios
            .get(`${api.post.paginated}/${page}`)
            .then(({ data }) =>
                setState((prev) => {
                    const { posts } = blogParser();
                    return {
                        ...prev,
                        posts: posts.parseAsPosts(data.posts),
                        totalPosts: posts.parseAsTotalPosts(data.totalPosts),
                    };
                })
            )
            .catch(ToastError);
    }, [page]);

    return (
        <div
            className={css`
                width: 100%;
                height: 100%;
                padding: 8px;
                box-sizing: border-box;
                display: grid;
                overflow-y: auto;
                overflow-x: hidden;
                ${scrollbarStyle};
            `}
        >
            {!posts.length ? (
                <div
                    className={css`
                        padding: 16px;
                        display: flex;
                        margin: auto;
                    `}
                >
                    <strong>No Blog Available Yet</strong>
                </div>
            ) : (
                <>
                    <div
                        className={css`
                            display: grid;
                             {
                                /* ref: https://stackoverflow.com/questions/43115822/can-i-make-a-css-grid-with-dynamic-number-of-rows-or-columns */
                            }
                            grid-template-columns: repeat(3, 1fr);
                            grid-template-rows: 1fr 1fr 1fr;
                            grid-gap: 36px;
                        `}
                    >
                        {posts.map(
                            ({ id, title, description, timePublished }) => (
                                <div
                                    key={id}
                                    onClick={() => setPostId(id)}
                                    className={css`
                                        padding: 16px;
                                        border-radius: 4px;
                                        box-shadow: 0 4px 6px -1px rgb(0 0 0 /
                                                        0.1),
                                            0 2px 4px -2px rgb(0 0 0 / 0.1);
                                        :hover {
                                            cursor: pointer;
                                        }
                                    `}
                                >
                                    <span
                                        className={css`
                                            color: #6b7280;
                                            margin: 8px 0;
                                        `}
                                    >
                                        {timePublished.toDateString()}
                                    </span>
                                    <h2
                                        className={css`
                                            color: #1756a9;
                                            margin: 8px 0;
                                        `}
                                    >
                                        {title}
                                    </h2>
                                    <div
                                        className={css`
                                            color: #4b5563;
                                        `}
                                    >
                                        {description}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <Pagination
                        totalPage={Math.ceil(totalPosts / postsPerPage)}
                        currentPage={page}
                        numberOfResults={totalPosts}
                        onClick={setPageHistory}
                    />
                </>
            )}
        </div>
    );
};

export default Posts;

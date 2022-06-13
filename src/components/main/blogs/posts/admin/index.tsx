import * as React from 'react';
import { css } from '@emotion/css';
import Pagination from '../../paginate';
import { UserItem } from '../../../../../history';
import { admin, api, postsPerPage } from '../../../../../util/const';
import {
    PostsQueryOption,
    AdminHandlePosts as AdminHandlePostsType,
} from '../../../../../common/type/post';
import blogParser from '../../../../../parser/blog';
import adonisAxios from '../../../../../axios';
import { ToastError, ToastPromise } from '../../../toasify';
import Select from 'react-select';
import { capitalize } from 'granula-string';
import adminPropsParser from '../../../../../parser/admin';
import { NonNullableAdonisAdmin } from '../../../../../auth';
import {
    GridThreePostContainer,
    NoPostsAvailableYet,
    PostContainer,
    PostsContainer,
} from '../common';
import { parseAsString } from 'parse-dont-validate';
import { NewPostButton } from '../../post/admin/button';

const AdminHandlePosts = ({
    setPostId,
    setPageHistory,
    shouldSetPageHistoryOnInitialLoad,
    getItem,
    scrollbarStyle,
    user,
    setQuery,
    queryOption,
    onAddNewPost,
}: Readonly<{
    setPostId: (id: string) => void;
    setPageHistory: (page: number) => void;
    shouldSetPageHistoryOnInitialLoad: boolean;
    getItem: () => 1 | UserItem;
    scrollbarStyle: string;
    user: NonNullableAdonisAdmin;
    setQuery: (query: PostsQueryOption, page: number) => void;
    queryOption: PostsQueryOption;
    onAddNewPost: () => void;
}>) => {
    const [state, setState] = React.useState<AdminHandlePostsType>({
        totalPosts: 0,
        type: 'published',
        posts: [],
    });

    const { totalPosts, type, posts } = state;

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
        const promise = new Promise<string>((res) =>
            user
                .getIdToken()
                .then((token) =>
                    adonisAxios
                        .get(
                            `${api.post.paginated}/${page}?queryOption=${queryOption}&token=${token}`
                        )
                        .then(({ data }) => {
                            setState((prev) => {
                                const { paginated } = blogParser();
                                const { posts } = adminPropsParser();
                                const type = posts.parseAsPostQueryOption(
                                    data.type
                                );

                                return {
                                    ...prev,
                                    totalPosts: paginated.parseAsTotalPosts(
                                        data.totalPosts
                                    ),
                                    ...(() => {
                                        switch (type) {
                                            case 'published':
                                                return {
                                                    type,
                                                    posts: paginated.parseAsPublishedPosts(
                                                        data.posts
                                                    ),
                                                };
                                            case 'unpublished':
                                                return {
                                                    type,
                                                    posts: paginated.parseAsUnpublishedPosts(
                                                        data.posts
                                                    ),
                                                };
                                            case 'deleted':
                                                return {
                                                    type,
                                                    posts: paginated.parseAsDeletedPosts(
                                                        data.posts
                                                    ),
                                                };
                                        }
                                    })(),
                                };
                            });
                            res('Completed');
                        })
                        .catch(ToastError)
                )
                .catch(ToastError)
        );
        ToastPromise({
            promise,
            pending: 'Querying posts...',
            success: {
                render: ({ data }) =>
                    parseAsString(data).orElseThrowDefault('data'),
            },
            error: {
                render: () => ToastError('Failed to query posts'),
            },
        });
    }, [queryOption, page]);

    return (
        <>
            <NewPostButton onAddNewPost={onAddNewPost} />
            <PostsContainer scrollbarStyle={scrollbarStyle}>
                {(() => {
                    const options: ReadonlyArray<{
                        value: PostsQueryOption;
                        label: string;
                    }> = admin.postQueryOptions.map((option) => ({
                        value: option,
                        label: capitalize(option),
                    }));

                    const value = options.find(
                        ({ value }) => queryOption === value
                    );

                    return (
                        <Select
                            defaultValue={value}
                            value={value}
                            placeholder="Search Posts"
                            maxMenuHeight={200}
                            className={css`
                                > div {
                                    background-color: #e6e6e6;
                                }
                                height: fit-content;
                                margin: 0 0 16px 0;
                            `}
                            options={options}
                            onChange={(option) => {
                                setPageHistory(1);
                                setQuery(
                                    adminPropsParser().posts.parseAsPostQueryOption(
                                        option?.value
                                    ),
                                    page
                                );
                            }}
                        />
                    );
                })()}
                {!posts.length ? (
                    <NoPostsAvailableYet />
                ) : (
                    <>
                        <GridThreePostContainer>
                            {(() => {
                                switch (type) {
                                    case 'published':
                                        return posts.map(
                                            ({
                                                id,
                                                title,
                                                description,
                                                timePublished,
                                            }) => (
                                                <PostContainer
                                                    key={id}
                                                    title={title}
                                                    description={description}
                                                    time={timePublished}
                                                    onClickPost={() =>
                                                        setPostId(id)
                                                    }
                                                />
                                            )
                                        );
                                    case 'unpublished':
                                        return posts.map(
                                            ({
                                                id,
                                                title,
                                                description,
                                                timeCreated,
                                            }) => (
                                                <PostContainer
                                                    key={id}
                                                    title={title}
                                                    description={description}
                                                    time={timeCreated}
                                                    onClickPost={() =>
                                                        setPostId(id)
                                                    }
                                                />
                                            )
                                        );
                                    case 'deleted':
                                        return posts.map(
                                            ({
                                                id,
                                                title,
                                                description,
                                                timeDeleted,
                                            }) => (
                                                <PostContainer
                                                    key={id}
                                                    title={title}
                                                    description={description}
                                                    time={timeDeleted}
                                                    onClickPost={() =>
                                                        setPostId(id)
                                                    }
                                                />
                                            )
                                        );
                                }
                            })()}
                        </GridThreePostContainer>
                        <Pagination
                            totalPage={Math.ceil(totalPosts / postsPerPage)}
                            currentPage={page}
                            numberOfResults={totalPosts}
                            onClick={setPageHistory}
                        />
                    </>
                )}
            </PostsContainer>
        </>
    );
};

export default AdminHandlePosts;

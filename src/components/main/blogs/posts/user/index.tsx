import * as React from 'react';
import Pagination from '../../paginate';
import { UserItem } from '../../../../../history';
import { api, postsPerPage } from '../../../../../util/const';
import { PublishedPosts, UserReadPosts } from '../../../../../common/type/post';
import blogParser from '../../../../../parser/blog';
import adonisAxios from '../../../../../axios';
import { ToastError, ToastPromise } from '../../../toasify';
import {
    GridThreePostContainer,
    NoPostsAvailableYet,
    PostContainer,
    PostsContainer,
} from '../common';
import { parseAsString } from 'parse-dont-validate';

const UserReadPublishedPosts = ({
    setPostId,
    setPageHistory,
    shouldSetPageHistoryOnInitialLoad,
    getItem,
    scrollbarStyle,
}: Readonly<{
    setPostId: (id: string) => void;
    setPageHistory: (page: number) => void;
    shouldSetPageHistoryOnInitialLoad: boolean;
    getItem: () => 1 | UserItem;
    scrollbarStyle: string;
}>) => {
    const [state, setState] = React.useState<UserReadPosts>({
        totalPosts: 0,
        posts: [] as PublishedPosts,
    });

    const { totalPosts, posts } = state;

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
            adonisAxios
                .get(`${api.post.paginated}/${page}`)
                .then(({ data }) => {
                    setState((prev) => {
                        const { paginated } = blogParser();
                        return {
                            ...prev,
                            posts: paginated.parseAsPublishedPosts(data.posts),
                            totalPosts: paginated.parseAsTotalPosts(
                                data.totalPosts
                            ),
                        };
                    });
                    res('Completed');
                })
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
    }, [page]);

    return (
        <PostsContainer scrollbarStyle={scrollbarStyle}>
            {!posts.length ? (
                <NoPostsAvailableYet />
            ) : (
                <>
                    <GridThreePostContainer>
                        {posts.map(
                            ({ id, title, description, timePublished }) => (
                                <PostContainer
                                    key={id}
                                    title={title}
                                    description={description}
                                    time={timePublished}
                                    onClickPost={() => setPostId(id)}
                                />
                            )
                        )}
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
    );
};

export default UserReadPublishedPosts;

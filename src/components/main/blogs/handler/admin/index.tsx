import * as React from 'react';
import Draggable from '../../../common/draggable';
import { Settings } from '../../../../../../pages/_app';
import Top from '../../../top';
import {
    commonState,
    defaultDimension,
    defaultPosition,
    Dimension,
    isFullHeightFunc,
    Position,
} from '../../../common';
import { createAdminHistory, AdminHistory } from '../../../../../history';
import historyPropsParser from '../../../../../parser/history';
import Navigation from '../../navigation';
import { useRouter } from 'next/router';
import nullableToUndefinedPropsParser from '../../../../../parser/type';
import AdminHandlePosts from '../../posts/admin';
import AdminHandlePost from '../../post/admin';
import { NonNullableAdonisAdmin } from '../../../../../auth';
import { PostsQueryOption } from '../../../../../common/type/post';
import {
    Container,
    ContentContainer,
    generate,
    maxHeight,
    scrollbarStyle,
} from '../common';
import NewPost from '../../post/admin/new-post';

const Blogs = ({
    settings: { isOpen, setIsOpen, isVisible, setIsVisible, zIndex, setZIndex },
    admin,
}: Readonly<{
    settings: Settings;
    admin: NonNullableAdonisAdmin;
}>) => {
    const [state, setState] = React.useState({
        ...commonState,
        history: undefined as AdminHistory | undefined,
        queryOption: 'published' as PostsQueryOption,
        isAddNewPost: false,
    });

    const { route } = useRouter();

    if (!(route === '/admin')) {
        throw new Error('Only admin can access this page');
    }

    const setDimension = (dimension: Dimension) =>
        setState((prev) => ({
            ...prev,
            ...dimension,
        }));

    const setLatestPosition = (latest: Position) =>
        setState((prev) => ({
            ...prev,
            position: {
                ...prev.position,
                latest,
            },
        }));

    const setPosition = (position: Position) =>
        setState((prev) => ({
            ...prev,
            position: {
                ...prev.position,
                latest: position,
                previous: position,
            },
        }));

    const {
        queryOption,
        height,
        width,
        history,
        position: { latest, previous },
        isAddNewPost,
    } = state;

    const isFullHeight = isFullHeightFunc(height, maxHeight);

    const stackKey = 'admin-stack';
    const indexNavigationKey = 'admin-indexNavigation';

    React.useEffect(() => {
        setState((prev) => ({
            ...prev,
            history: (() => {
                const { parseAsAdminStack, parseAsIndexNavigation } =
                    historyPropsParser();
                const { parseValue } = nullableToUndefinedPropsParser();
                const stack = parseAsAdminStack(
                    parseValue(localStorage.getItem(stackKey))
                );
                return createAdminHistory({
                    stack,
                    indexNavigation: parseAsIndexNavigation(
                        parseValue(localStorage.getItem(indexNavigationKey)),
                        stack.length - 1
                    ),
                });
            })(),
        }));
    }, []);

    React.useEffect(() => {
        if (history) {
            const { indexNavigation, stack } = history;
            localStorage.setItem(stackKey, JSON.stringify(stack));
            localStorage.setItem(
                indexNavigationKey,
                JSON.stringify(indexNavigation)
            );
        }
    }, [JSON.stringify(history?.stack), history?.indexNavigation]);

    if (!history || !isOpen) {
        return null;
    }

    const { stack } = history;

    return (
        <Draggable isFullHeight={isFullHeight} setPosition={setPosition}>
            <div
                onClick={setZIndex}
                onMouseDown={(event) => {
                    event.stopPropagation();
                    setZIndex();
                }}
                className={generate({
                    ...latest,
                    isFullHeight,
                    zIndex,
                    width,
                    isVisible,
                })}
            >
                <Container>
                    <Top
                        title="Blog"
                        isFullHeight={isFullHeight}
                        onClickMinimizeIcon={() => setIsVisible(false)}
                        onClickCloseIcon={() => {
                            setIsOpen(false);
                            setIsVisible(false);
                        }}
                        onClickMaximizeIcon={() => {
                            setDimension(
                                isFullHeight
                                    ? defaultDimension
                                    : {
                                          height: maxHeight,
                                          width: '100%',
                                      }
                            );
                            setLatestPosition(
                                isFullHeight ? previous : defaultPosition
                            );
                        }}
                    />
                    <ContentContainer isFullHeight={isFullHeight}>
                        <Navigation
                            title="Blog History"
                            forward={{
                                isNavigatable: history.isForwardNavigatable,
                                onClicked: () =>
                                    setState((prev) => ({
                                        ...prev,
                                        history: history.forward(),
                                        isAddNewPost: false,
                                    })),
                            }}
                            backward={{
                                isNavigatable: history.isBackwardNavigatable,
                                onClicked: () =>
                                    setState((prev) => ({
                                        ...prev,
                                        history: history.backward(),
                                        isAddNewPost: false,
                                    })),
                            }}
                        />
                        {(() => {
                            if (isAddNewPost) {
                                return (
                                    <NewPost
                                        admin={admin}
                                        onAddNewPost={() =>
                                            setState((prev) => ({
                                                ...prev,
                                                isAddNewPost: false,
                                            }))
                                        }
                                    />
                                );
                            }
                            const current = history.current();
                            switch (current?.type) {
                                case 'one':
                                    return (
                                        <AdminHandlePost
                                            queryOption={current.queryOption}
                                            id={current.id}
                                            scrollbarStyle={scrollbarStyle}
                                            admin={admin}
                                        />
                                    );
                                case undefined:
                                case 'paginated': {
                                    const finalQueryOption =
                                        current?.queryOption ?? queryOption;
                                    return (
                                        <AdminHandlePosts
                                            user={admin}
                                            scrollbarStyle={scrollbarStyle}
                                            shouldSetPageHistoryOnInitialLoad={
                                                !stack.length
                                            }
                                            onAddNewPost={() =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    isAddNewPost: true,
                                                }))
                                            }
                                            queryOption={finalQueryOption}
                                            setQuery={(queryOption, page) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    queryOption,
                                                    isAddNewPost: false,
                                                    history: history.push({
                                                        type: 'paginated',
                                                        page,
                                                        queryOption,
                                                    }),
                                                }))
                                            }
                                            getItem={() =>
                                                history.current() ??
                                                stack
                                                    .slice()
                                                    .reverse()
                                                    .find(
                                                        (item) =>
                                                            item.type ===
                                                            'paginated'
                                                    ) ??
                                                1
                                            }
                                            setPageHistory={(page) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    isAddNewPost: false,
                                                    history: history.push({
                                                        type: 'paginated',
                                                        page,
                                                        queryOption:
                                                            finalQueryOption,
                                                    }),
                                                }))
                                            }
                                            setPostId={(id) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    isAddNewPost: false,
                                                    history: history.push({
                                                        type: 'one',
                                                        id,
                                                        queryOption:
                                                            finalQueryOption,
                                                    }),
                                                }))
                                            }
                                        />
                                    );
                                }
                            }
                        })()}
                    </ContentContainer>
                </Container>
            </div>
        </Draggable>
    );
};

export default Blogs;

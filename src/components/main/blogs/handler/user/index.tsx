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
import UserReadPublishedPosts from '../../posts/user';
import { createUserHistory, UserHistory } from '../../../../../history';
import historyPropsParser from '../../../../../parser/history';
import Navigation from '../../navigation';
import nullableToUndefinedPropsParser from '../../../../../parser/type';
import UserReadPost from '../../post/user';
import {
    Container,
    ContentContainer,
    generate,
    maxHeight,
    scrollbarStyle,
} from '../common';

const Blogs = ({
    settings: { isOpen, setIsOpen, isVisible, setIsVisible, zIndex, setZIndex },
}: Readonly<{
    settings: Settings;
}>) => {
    const [state, setState] = React.useState({
        ...commonState,
        history: undefined as UserHistory | undefined,
    });

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
        height,
        width,
        history,
        position: { latest, previous },
    } = state;

    const isFullHeight = isFullHeightFunc(height, maxHeight);

    const stackKey = 'stack';
    const indexNavigationKey = 'indexNavigation';

    React.useEffect(() => {
        setState((prev) => ({
            ...prev,
            history: (() => {
                const { parseAsUserStack, parseAsIndexNavigation } =
                    historyPropsParser();
                const { parseValue } = nullableToUndefinedPropsParser();
                const stack = parseAsUserStack(
                    parseValue(localStorage.getItem(stackKey))
                );
                return createUserHistory({
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
                                    })),
                            }}
                            backward={{
                                isNavigatable: history.isBackwardNavigatable,
                                onClicked: () =>
                                    setState((prev) => ({
                                        ...prev,
                                        history: history.backward(),
                                    })),
                            }}
                        />
                        {(() => {
                            const current = history.current();
                            switch (current?.type) {
                                case 'one':
                                    return (
                                        <UserReadPost
                                            id={current.id}
                                            scrollbarStyle={scrollbarStyle}
                                        />
                                    );
                                case undefined:
                                case 'paginated':
                                    return (
                                        <UserReadPublishedPosts
                                            scrollbarStyle={scrollbarStyle}
                                            shouldSetPageHistoryOnInitialLoad={
                                                !stack.length
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
                                                    history: history.push({
                                                        type: 'paginated',
                                                        page,
                                                    }),
                                                }))
                                            }
                                            setPostId={(id) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    history: history.push({
                                                        type: 'one',
                                                        id,
                                                    }),
                                                }))
                                            }
                                        />
                                    );
                            }
                        })()}
                    </ContentContainer>
                </Container>
            </div>
        </Draggable>
    );
};

export default Blogs;

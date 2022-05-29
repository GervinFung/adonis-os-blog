import * as React from 'react';
import Draggable from '../common/draggable';
import { css } from '@emotion/css';
import { Settings } from '../../../../pages/_app';
import Top from '../top';
import {
    commonState,
    defaultDimension,
    defaultPosition,
    Dimension,
    isFullHeightFunc,
    Position,
} from '../common';
import Post from './post';
import Posts from './posts';
import { createHistory, History } from '../../../history';
import historyPropsParser from '../../../parser/history';
import parseNullableAsDefaultOrUndefined from '../../../parser/type/nullToUndefined';
import Navigation from './navigation';

const Blogs = ({
    settings: { isOpen, setIsOpen, isVisible, setIsVisible, zIndex, setZIndex },
}: Readonly<{
    settings: Settings;
}>) => {
    const [state, setState] = React.useState({
        ...commonState,
        history: undefined as History | undefined,
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

    const maxHeight = '100%';

    const isFullHeight = isFullHeightFunc(height, maxHeight);

    const stackKey = 'stack';
    const indexNavigationKey = 'indexNavigation';

    React.useEffect(() => {
        setState((prev) => ({
            ...prev,
            history: (() => {
                const history = historyPropsParser();
                const stack = history.parseAsStack(
                    parseNullableAsDefaultOrUndefined(
                        localStorage.getItem(stackKey)
                    )
                );
                const indexNavigation = history.parseAsIndexNavigation(
                    parseNullableAsDefaultOrUndefined(
                        localStorage.getItem(indexNavigationKey)
                    ),
                    stack.length - 1
                );
                return createHistory({ stack, indexNavigation });
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

    const scrollbarStyle = css`
        *::-webkit-scrollbar {
            width: 6px;
        }
        *::-webkit-scrollbar-track {
            background-color: transparent !important;
        }
        *::-webkit-scrollbar-thumb {
            border: 2px solid transparent;
            background-clip: padding-box;
            border-radius: 9999px;
            background-color: gray;
        }
    `;

    const { stack } = history;

    return (
        <Draggable isFullHeight={isFullHeight} setPosition={setPosition}>
            <div
                onClick={setZIndex}
                onMouseDown={(event) => {
                    event.stopPropagation();
                    setZIndex();
                }}
                className={css`
                    position: absolute;
                    height: 100%;
                    left: ${isFullHeight ? '0' : '25%'};
                    z-index: ${zIndex};
                    width: ${width};
                    transform: translate(${latest.x}, ${latest.y}) !important;
                    visibility: ${isVisible ? 'visible' : 'hidden'};
                    align-items: ${isFullHeight ? 'unset' : 'center'};
                `}
            >
                <div
                    className={css`
                        display: flex;
                        flex-flow: column;
                        height: 100%;
                        width: 100%;
                        ${scrollbarStyle};
                    `}
                >
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
                    <div
                        className={css`
                            background-color: #e6e6fa;
                            color: #535353;
                            width: 100%;
                            height: 100%;
                            max-height: ${isFullHeight ? maxHeight : '78vh'};
                            display: flex;
                            flex-flow: column;
                        `}
                    >
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
                                case 'post': {
                                    return (
                                        <Post
                                            id={current.id}
                                            scrollbarStyle={scrollbarStyle}
                                        />
                                    );
                                }
                                case undefined:
                                case 'posts':
                                    return (
                                        <Posts
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
                                                            'posts'
                                                    ) ??
                                                1
                                            }
                                            setPageHistory={(page) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    history: history.push({
                                                        type: 'posts',
                                                        page,
                                                    }),
                                                }))
                                            }
                                            setPostId={(id) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    history: history.push({
                                                        type: 'post',
                                                        id,
                                                    }),
                                                }))
                                            }
                                        />
                                    );
                            }
                        })()}
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default Blogs;

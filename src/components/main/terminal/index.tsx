import * as React from 'react';
import ReactUnixTerminal from 'react-unix-terminal';
import Draggable from '../common/draggable';
import json from '../../../../package.json';
import 'react-unix-terminal/dist/style.css';
import { css } from '@emotion/css';
import { AppContext, Settings } from '../../../../pages/_app';
import Top from '../top';
import {
    commonState,
    defaultDimension,
    defaultPosition,
    Dimension,
    isFullHeightFunc,
    Position,
} from '../common';

const Terminal = ({
    settings: { isOpen, setIsOpen, isVisible, setIsVisible, zIndex, setZIndex },
}: Readonly<{
    settings: Settings;
}>) => {
    if (!isOpen) {
        return null;
    }

    const open = (link: string) =>
        window.open(link, '_blank', 'noopener, noreferrer');

    const [state, setState] = React.useState(commonState);

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
        position: { latest, previous },
    } = state;

    const maxHeight = '100%';

    const isFullHeight = isFullHeightFunc(height, maxHeight);

    const { blogsSettings } = React.useContext(AppContext);

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
                        width: 100%;
                        height: ${
                            !isFullHeight ? height : `calc(${height} - 34.72px)`
                        };
                        .react-unix-terminal-terminal-flexible-height-width-app-container {
                            border-bottom-left-radius: 4px;
                            border-bottom-right-radius: 4px;
                    `}
                >
                    <Top
                        title="Term"
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
                    <ReactUnixTerminal
                        user="guest"
                        name="poolofdeath20"
                        fontFamily="JetBrains+Mono"
                        height={!isFullHeight ? '450px' : '100%'}
                        width="100%"
                        commands={{
                            vi: () => `why use 'vi'? when you can use 'vim'`,
                            vim: () => `vi improved? give 'nvim' a try, cmon`,
                            emacs: () => `emacs? seriously? legends use 'nano'`,
                            nvim: () =>
                                `nvim is good, but I heard 'emacs' is not bad too`,
                            nano: () =>
                                `one does not simply use nano, one shall use 'vi' to be efficient`,
                            blog: () => {
                                const { isOpen } = blogsSettings;
                                if (isOpen) {
                                    blogsSettings.setZIndex();
                                    return 'blog already opened!';
                                }
                                blogsSettings.setIsVisible(true);
                                blogsSettings.setIsOpen(true);
                                return 'blog opened!\nsending blog to background process...\ncompleted!';
                            },
                            exit: () => {
                                setIsOpen(false);
                                return '';
                            },
                            php: () => {
                                open(
                                    'https://www.reddit.com/r/ProgrammerHumor/comments/7ug52d/another_php_joke/'
                                );
                                return 'as a TypeScript developer, I am required to detest PHP. just kiding';
                            },
                            tsc: () => {
                                open(
                                    'https://www.reddit.com/r/ProgrammerHumor/comments/csi35q/typescript_and_javascript/'
                                );
                                return `version ${json.devDependencies.typescript.replace(
                                    '^',
                                    ''
                                )}`;
                            },
                            julia: () =>
                                'ah yes my beloved, wonder who she is? click <a href="https://julialang.org/" target="_blank" rel="external nofollow noopener noreferrer">Here</a> to find out more',
                        }}
                    />
                </div>
            </div>
        </Draggable>
    );
};

export default Terminal;

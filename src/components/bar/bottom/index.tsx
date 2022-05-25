import * as React from 'react';
import { css } from '@emotion/css';
import { AppContext } from '../../../../pages/_app';
import Element from './element';

const BottomBar = () => {
    const { terminalSettings, blogsSettings } = React.useContext(AppContext);

    return (
        <div
            className={css`
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                z-index: 2;
            `}
        >
            <div
                className={css`
                    padding: 2px;
                    box-sizing: border-box;
                    border-radius: 24px;
                    margin: 0 auto;
                    color: white;
                    background-color: #000000bf;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                `}
            >
                <Element
                    imgName="blog"
                    isActive={blogsSettings.isOpen}
                    action={{
                        type: 'button',
                        onClick: () => {
                            const { isOpen } = blogsSettings;
                            if (isOpen) {
                                blogsSettings.setZIndex();
                            } else {
                                blogsSettings.setIsVisible(true);
                                blogsSettings.setIsOpen(true);
                            }
                        },
                    }}
                />
                <Element
                    imgName="terminal"
                    isActive={terminalSettings.isOpen}
                    action={{
                        type: 'button',
                        onClick: () => {
                            const { isOpen } = terminalSettings;
                            if (isOpen) {
                                terminalSettings.setZIndex();
                            } else {
                                terminalSettings.setIsVisible(true);
                                terminalSettings.setIsOpen(true);
                            }
                        },
                    }}
                />
                <Element
                    imgName="poolofdeath20"
                    isActive={false}
                    action={{
                        type: 'link',
                        href: 'https://poolofdeath20.herokuapp.com/',
                    }}
                />
            </div>
        </div>
    );
};

export default BottomBar;

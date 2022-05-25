import * as React from 'react';
import {
    VscChromeMaximize,
    VscChromeMinimize,
    VscChromeRestore,
    VscChromeClose,
} from 'react-icons/vsc';
import { css } from '@emotion/css';

const Top = ({
    onClickMinimizeIcon,
    onClickMaximizeIcon,
    onClickCloseIcon,
    isFullHeight,
    title,
}: Readonly<{
    onClickMinimizeIcon: () => void;
    onClickMaximizeIcon: () => void;
    onClickCloseIcon: () => void;
    isFullHeight: boolean;
    title: string;
}>) => {
    const iconStyle = css`
        cursor: pointer;
        font-size: 1.15em;
        margin: 0 0 0 8px;
    `;

    const MaximizeIcon = isFullHeight ? VscChromeRestore : VscChromeMaximize;

    return (
        <div
            className={css`
                background-color: #181f21;
                color: #fff;
                width: 100%;
                padding: 8px;
                box-sizing: border-box;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: ${isFullHeight ? 'default' : 'grabbing'};
            `}
        >
            <div>{title}</div>
            <div>
                <VscChromeMinimize
                    className={iconStyle}
                    onClick={onClickMinimizeIcon}
                />
                <MaximizeIcon
                    className={iconStyle}
                    onClick={onClickMaximizeIcon}
                />
                <VscChromeClose
                    className={iconStyle}
                    onClick={onClickCloseIcon}
                />
            </div>
        </div>
    );
};

export default Top;

import * as React from 'react';
import { css } from '@emotion/css';

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

const Container = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <div
        className={css`
            display: flex;
            flex-flow: column;
            height: 100%;
            width: 100%;
            ${scrollbarStyle};
        `}
    >
        {children}
    </div>
);

const maxHeight = '100%';

const ContentContainer = ({
    children,
    isFullHeight,
}: Readonly<{
    children: React.ReactNode;
    isFullHeight: boolean;
}>) => (
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
        {children}
    </div>
);

const generate = ({
    isFullHeight,
    zIndex,
    width,
    isVisible,
    x,
    y,
}: Readonly<{
    isFullHeight: boolean;
    zIndex: 0 | 1;
    width: string;
    isVisible: boolean;
    x: number;
    y: number;
}>) => css`
    position: absolute;
    height: 100%;
    left: ${isFullHeight ? '0' : '25%'};
    z-index: ${zIndex};
    width: ${width};
    transform: translate(${x}, ${y}) !important;
    visibility: ${isVisible ? 'visible' : 'hidden'};
    align-items: ${isFullHeight ? 'unset' : 'center'};
`;

export { maxHeight, scrollbarStyle, generate, Container, ContentContainer };

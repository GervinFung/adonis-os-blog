import * as React from 'react';
import { css } from '@emotion/css';

const Button = ({
    onClick,
    buttonClassName,
    containerClassName,
    name,
}: Readonly<{
    onClick: () => void;
    containerClassName?: string;
    buttonClassName?: string;
    name: string;
}>) => (
    <div
        className={css`
            width: 100%;
            display: grid;
            place-items: center;
            border: 1px solid black;
            border-top: none;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            padding: 0 0 32px 0;
            box-sizing: border-box;
            background-color: #fefefe;
            ${containerClassName ?? ''}
        `}
        onClick={onClick}
    >
        <div
            className={css`
                text-align: center;
                cursor: pointer;
                width: fit-content;
                border-radius: 8px;
                padding: 12px 24px;
                box-sizing: border-box;
                color: #fefefe;
                background-color: #121212;
                ${buttonClassName ?? ''}
            `}
        >
            {name}
        </div>
    </div>
);

export default Button;

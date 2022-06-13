import { css } from '@emotion/css';
import * as React from 'react';

const fieldStyle = css`
    background: transparent;
    outline: none;
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid black;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
`;

const Input = ({
    type,
    name,
    placeHolder,
    value,
    onChange,
    className,
}: Readonly<{
    type: 'password' | 'email' | 'text';
    name?: string;
    placeHolder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}>) => (
    <input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        type={type}
        required={true}
        placeholder={placeHolder}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={css`
            ${fieldStyle}
            ${className}
        `}
    />
);

export { fieldStyle };

export default Input;

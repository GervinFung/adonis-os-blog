import * as React from 'react';
import { css } from '@emotion/css';

const Field = ({
    value,
    setValue,
    name,
    type,
    placeHolder,
}: Readonly<
    | {
          value: string;
          setValue: (value: string) => void;
          placeHolder: string;
      } & (
          | {
                name: 'Password';
                type: 'password';
            }
          | {
                name: 'Email';
                type: 'email';
            }
      )
>) => (
    <div
        className={css`
            margin: 0 0 16px 0;
            width: 100%;
        `}
    >
        <div
            className={css`
                display: flex;
                margin: 0 0 8px 0;
            `}
        >
            <label htmlFor={name}>{name}</label>
        </div>
        <div
            className={css`
                display: flex;
            `}
        >
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
                onChange={(event) => setValue(event.target.value)}
                className={css`
                    outline: none;
                    padding: 12px 16px;
                    border-radius: 4px;
                    border: 1px solid black;
                    width: 100%;
                    box-sizing: border-box;
                    resize: vertical;
                `}
            />
        </div>
    </div>
);

export default Field;

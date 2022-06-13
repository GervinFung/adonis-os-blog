import * as React from 'react';
import { css } from '@emotion/css';
import Input from '../../common/input';

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
            <Input
                type={type}
                placeHolder={placeHolder}
                name={name}
                value={value}
                onChange={setValue}
            />
        </div>
    </div>
);

export default Field;

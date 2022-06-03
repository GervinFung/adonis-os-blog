import * as React from 'react';
import { css } from '@emotion/css';
import Field from './field';

type FieldProps = Readonly<{
    value: string;
    setValue: (value: string) => void;
}>;

const Input = ({
    email,
    password,
}: Readonly<{
    email: FieldProps;
    password: FieldProps;
}>) => (
    <div
        className={css`
            display: flex;
            flex-direction: column;
            padding: 32px 40px;
            border: 1px solid black;
            border-bottom: none;
            background-color: #fefefe;
        `}
    >
        <Field
            type="email"
            placeHolder="johnwick@gmail.com"
            name="Email"
            value={email.value}
            setValue={email.setValue}
        />
        <Field
            type="password"
            placeHolder={`*`.repeat(20)}
            name="Password"
            value={password.value}
            setValue={password.setValue}
        />
    </div>
);

export type { FieldProps };

export default Input;

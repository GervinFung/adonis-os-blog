import { css } from '@emotion/css';
import * as React from 'react';
import LoginButton from './button';
import Header from './header';
import Input, { FieldProps } from './input';

const Auth = () => {
    const [state, setState] = React.useState({
        email: '',
        password: '',
    });

    const { email, password } = state;

    const createProps = (propName: 'email' | 'password'): FieldProps => ({
        value: state[propName],
        setValue: (value) =>
            setState((prev) => ({
                ...prev,
                [propName]: value,
            })),
    });

    return (
        <div
            className={css`
                width: 100%;
                margin: auto;
            `}
        >
            <div
                className={css`
                    width: 50%;
                    margin: auto;
                    box-sizing: border-box;
                `}
            >
                <Header />
                <Input
                    email={createProps('email')}
                    password={createProps('password')}
                />
                <LoginButton email={email} password={password} />
            </div>
        </div>
    );
};

export default Auth;

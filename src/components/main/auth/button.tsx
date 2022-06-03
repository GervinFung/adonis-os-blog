import * as React from 'react';
import { css } from '@emotion/css';
import { adonisUser } from '../../../auth';
import { ToastError, ToastInfo } from '../toasify';

const Button = (
    data: Readonly<{
        email: string;
        password: string;
    }>
) => (
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
        `}
        onClick={async () => {
            const result = await adonisUser.signIn(data);
            switch (result.type) {
                case 'succeed':
                    return ToastInfo(`Welcome ${result.name ?? data.email}`);
                case 'failed': {
                    const { error } = result;
                    if (error instanceof Error) {
                        const { message } = error;
                        return ToastError(
                            message.includes('password') ||
                                message.includes('email')
                                ? 'Invalid credential'
                                : message
                        );
                    }
                    if (typeof error === 'string') {
                        return ToastError(error);
                    }
                    return ToastError(JSON.stringify(error));
                }
            }
        }}
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
            `}
        >
            Login
        </div>
    </div>
);

export default Button;

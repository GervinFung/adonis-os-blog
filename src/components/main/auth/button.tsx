import * as React from 'react';
import { adonisAdmin } from '../../../auth';
import { ToastError, ToastInfo } from '../toasify';
import Button from '../common/button';

const LoginButton = (
    data: Readonly<{
        email: string;
        password: string;
    }>
) => (
    <Button
        name="Login"
        onClick={async () => {
            const result = await adonisAdmin.signIn(data);
            switch (result.type) {
                case 'succeed':
                    return ToastInfo(`Welcome ${result.name ?? data.email}`);
                case 'failed': {
                    const { error } = result;
                    if (!(error instanceof Error)) {
                        return ToastError(error);
                    }
                    const { message } = error;
                    return ToastError(message, (message) =>
                        message.includes('password') ||
                        message.includes('email')
                            ? 'Invalid credential'
                            : message
                    );
                }
            }
        }}
    ></Button>
);

export default LoginButton;

import * as React from 'react';
import { css } from '@emotion/css';
import Terminal from '../src/components/main/terminal';
import Blogs from '../src/components/main/blogs/handler/admin';
import { AppContext } from './_app';
import Auth from '../src/components/main/auth';

const Admin = () => {
    const { admin, terminalSettings, blogsSettings } =
        React.useContext(AppContext);

    return (
        <div
            className={css`
                width: 100%;
                height: 100%;
                position: relative;
            `}
        >
            {!admin ? (
                <Auth />
            ) : (
                <>
                    <Terminal settings={terminalSettings} />
                    <Blogs admin={admin} settings={blogsSettings} />
                </>
            )}
        </div>
    );
};

export default Admin;

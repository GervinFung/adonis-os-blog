import * as React from 'react';
import { css } from '@emotion/css';
import Terminal from '../src/components/main/terminal';
import Blogs from '../src/components/main/blogs/handler/user';
import { AppContext } from './_app';

const Index = () => {
    const { terminalSettings, blogsSettings } = React.useContext(AppContext);

    return (
        <div
            className={css`
                width: 100%;
                height: 100%;
                position: relative;
            `}
        >
            <Terminal settings={terminalSettings} />
            <Blogs settings={blogsSettings} />
        </div>
    );
};

export default Index;

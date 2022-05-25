import * as React from 'react';
import { css } from '@emotion/css';
import { FcLinux } from 'react-icons/fc';
import { iconStyle } from './util-icons';

const OsName = () => (
    <div
        className={css`
            display: flex;
            margin: 0 auto 0 0;
        `}
    >
        <FcLinux
            className={css`
                ${iconStyle};
            `}
        />
        Adonis
    </div>
);

export default OsName;

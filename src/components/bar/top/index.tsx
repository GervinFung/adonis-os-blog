import * as React from 'react';
import { css } from '@emotion/css';
import dynamic from 'next/dynamic';
import OsName from './os-name';
import UtilIcons from './util-icons';
const DateTime = dynamic(() => import('./date-time'), { ssr: false });

const TopBar = () => (
    <header
        className={css`
            width: 100%;
            background-color: #000000e6;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            color: #fff;
            padding: 4px 8px;
            box-sizing: border-box;
        `}
    >
        <OsName />
        <DateTime />
        <UtilIcons />
    </header>
);

export default TopBar;

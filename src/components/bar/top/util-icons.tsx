import * as React from 'react';
import { css } from '@emotion/css';
import { AiOutlineWifi } from 'react-icons/ai';
import { BsBatteryFull, BsFillVolumeUpFill } from 'react-icons/bs';

const iconStyle = css`
    margin: 0 6px;
    font-size: 1.25em;
`;

const UtilIcons = () => (
    <div
        className={css`
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 0 0 auto;
        `}
    >
        <AiOutlineWifi
            className={css`
                ${iconStyle};
            `}
        />
        <BsFillVolumeUpFill
            className={css`
                ${iconStyle};
            `}
        />
        <BsBatteryFull
            className={css`
                ${iconStyle};
            `}
        />
    </div>
);

export { iconStyle };

export default UtilIcons;

import { css } from '@emotion/css';
import * as React from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

type NavigatableProps = Readonly<{
    isNavigatable: boolean;
    onClicked: () => void;
}>;

const Navigation = ({
    title,
    forward,
    backward,
}: Readonly<{
    title: string;
    forward: NavigatableProps;
    backward: NavigatableProps;
}>) => {
    const navigationContainer = css`
        border-radius: 50%;
        padding: 4px;
        display: grid;
        place-items: center;
        margin: 8px;
    `;

    const getCursorForContainer = (isNavigatable: boolean) =>
        isNavigatable ? 'pointer' : 'not-allowed';

    const forwardNavigationContainer = css`
        cursor: ${getCursorForContainer(forward.isNavigatable)};
        ${navigationContainer};
    `;

    const backwardNavigationContainer = css`
        cursor: ${getCursorForContainer(backward.isNavigatable)};
        ${navigationContainer};
    `;

    const navigationIcon = css`
        height: 16px;
        width: 16px;
        display: grid;
        place-items: center;
        color: #535353;
    `;

    return (
        <div
            className={css`
                padding: 4px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            `}
        >
            <div
                className={backwardNavigationContainer}
                onClick={backward.onClicked}
            >
                <IoChevronBackOutline className={navigationIcon} />
            </div>
            <div>
                <b>{title}</b>
            </div>
            <div
                className={forwardNavigationContainer}
                onClick={forward.onClicked}
            >
                <IoChevronForwardOutline className={navigationIcon} />
            </div>
        </div>
    );
};

export default Navigation;

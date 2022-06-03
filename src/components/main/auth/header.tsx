import * as React from 'react';
import { css } from '@emotion/css';

const Header = () => {
    const titleStyle = css`
        text-align: left;
        font-size: 1.35rem;
    `;
    const messageStyle = css`
        padding: 1px;
        flex-wrap: wrap;
        margin: 0 0 8px 0;
    `;

    return (
        <div
            className={css`
                width: 100%;
                padding: 32px;
                text-align: justify;
                box-sizing: border-box;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                border: 1px solid black;
                border-bottom: none;
                background-color: #fefefe;
            `}
        >
            <div className={messageStyle}>
                <span className={titleStyle}>
                    <strong>Welcome</strong>
                </span>
            </div>
            <div className={messageStyle}>
                This is the admin page of the application, please verify that
                this web application belongs to you, as there is only one user
                per domain. If this does not belongs to you and you wish to have
                one for yourself, you can create one yourself
            </div>
        </div>
    );
};

export default Header;

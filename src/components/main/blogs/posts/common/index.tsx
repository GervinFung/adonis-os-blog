import * as React from 'react';
import { css } from '@emotion/css';
import { PostCommonProps } from '../../../../../common/type/post';

const PostsContainer = ({
    children,
    scrollbarStyle,
}: Readonly<{
    children: React.ReactNode;
    scrollbarStyle: string;
}>) => (
    <div
        className={css`
            width: 100%;
            height: 100%;
            padding: 8px;
            box-sizing: border-box;
            display: grid;
            overflow-y: auto;
            overflow-x: hidden;
            ${scrollbarStyle};
        `}
    >
        {children}
    </div>
);

const NoPostsAvailableYet = () => (
    <div
        className={css`
            padding: 16px;
            display: flex;
            margin: auto;
        `}
    >
        <strong>No Blog Available Yet</strong>
    </div>
);

const PostContainer = ({
    description,
    title,
    time,
    onClickPost,
}: Omit<PostCommonProps, 'content'> &
    Readonly<{
        onClickPost: () => void;
        time: Date;
    }>) => (
    <div
        onClick={onClickPost}
        className={css`
            padding: 16px;
            border-radius: 4px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                0 2px 4px -2px rgb(0 0 0 / 0.1);
            :hover {
                cursor: pointer;
            }
        `}
    >
        <span
            className={css`
                color: #6b7280;
                margin: 8px 0;
            `}
        >
            {time.toDateString()}
        </span>
        <h2
            className={css`
                color: #1756a9;
                margin: 8px 0;
            `}
        >
            {title}
        </h2>
        <div
            className={css`
                color: #4b5563;
            `}
        >
            {description}
        </div>
    </div>
);

const GridThreePostContainer = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <div
        className={css`
            display: grid;
             {
                /* ref: https://stackoverflow.com/questions/43115822/can-i-make-a-css-grid-with-dynamic-number-of-rows-or-columns */
            }
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: 1fr 1fr 1fr;
            grid-gap: 36px;
        `}
    >
        {children}
    </div>
);

export {
    PostsContainer,
    PostContainer,
    NoPostsAvailableYet,
    GridThreePostContainer,
};

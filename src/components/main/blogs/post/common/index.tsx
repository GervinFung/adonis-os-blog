import * as React from 'react';
import { css } from '@emotion/css';
import { capitalize } from 'granula-string';
import minutesToRead from 'minutes-to-read';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import {
    NonNullablePublishedPost,
    PostsQueryOption,
} from '../../../../../common/type/post';
import Input, { fieldStyle } from '../../../common/input';

// ref: https://smarative.com/blog/nextjs-libraries-for-render-markdown-in-a-secure-way
const ReadonlyPost = ({
    post: { title, description, content, timePublished },
    scrollbarStyle,
    blackColor,
}: Readonly<{
    scrollbarStyle: string;
    blackColor: string;
    post: NonNullablePublishedPost;
}>) => (
    <div
        className={css`
            padding: 8px 16px;
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
            ${scrollbarStyle};
        `}
    >
        <h3 className={blackColor}>{title}</h3>
        <p>{timePublished.toDateString()}</p>
        <p className={blackColor}>{description}</p>
        <em>{capitalize(minutesToRead(content))}</em>
        <div
            className={css`
                work-break: break-word;
                ${blackColor}
            `}
        >
            {
                unified()
                    .use(remarkParse)
                    .use(remarkRehype)
                    .use(rehypeReact, {
                        createElement: React.createElement,
                    })
                    .processSync(content).result
            }
        </div>
    </div>
);

const PostUnavailable = ({
    type,
}: Readonly<{
    type: PostsQueryOption;
}>) => (
    <div
        className={css`
            padding: 8px 16px;
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
        `}
    >
        The post you looking maybe{' '}
        {(() => {
            switch (type) {
                case 'published':
                    return 'unpublished';
                case 'unpublished':
                    return 'published';
                case 'deleted':
                    return 'restored';
            }
        })()}
    </div>
);

const grayBorder = css`
    border: 1px solid gray;
`;

const TitleInput = ({
    title,
    onTitleChange,
}: Readonly<{
    title: string;
    onTitleChange: (title: string) => void;
}>) => (
    <Input
        type="text"
        placeHolder="Title"
        className={grayBorder}
        value={title}
        onChange={onTitleChange}
    />
);

const DescriptionInput = ({
    description,
    onDescriptionChange,
}: Readonly<{
    description: string;
    onDescriptionChange: (title: string) => void;
}>) => (
    <Input
        type="text"
        placeHolder="Description"
        className={grayBorder}
        value={description}
        onChange={onDescriptionChange}
    />
);

const ContentInput = ({
    content,
    onContentChange,
}: Readonly<{
    content: string;
    onContentChange: (content: string) => void;
}>) => (
    <textarea
        value={content}
        placeholder="Content"
        className={css`
            height: 100%;
            margin: 24px 0 0 0;
            resize: none;
            ${fieldStyle}
            ${grayBorder}
        `}
        onChange={(event) => onContentChange(event.target.value)}
    />
);

export {
    ReadonlyPost,
    PostUnavailable,
    TitleInput,
    DescriptionInput,
    ContentInput,
};

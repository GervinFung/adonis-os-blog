import * as React from 'react';
import { css } from '@emotion/css';
import axios from 'axios';
import minutesToRead from 'minutes-to-read';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import { ReadPost } from '../../../../common/type';
import { blogParser } from '../../../../parser';
import { val } from '../../../../util/const';
import { capitalize } from 'granula-string';

const Post = ({
    id,
    scrollbarStyle,
}: Readonly<{
    id: string;
    scrollbarStyle: string;
}>) => {
    const [state, setState] = React.useState({
        post: undefined as ReadPost | undefined,
    });

    const { post } = state;

    React.useEffect(() => {
        axios
            .get(`/api/${val.post}/${id}`)
            .then(({ data }) =>
                setState((prev) => {
                    const { post } = blogParser();
                    return {
                        ...prev,
                        post: post.parseAsPost(data.post),
                    };
                })
            )
            .catch(alert);
    }, []);

    if (!post) {
        return null;
    }

    const { title, description, content, timePublished } = post;

    const blackColor = css`
        color: #121212;
    `;

    // ref: https://smarative.com/blog/nextjs-libraries-for-render-markdown-in-a-secure-way
    return (
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
};

export default Post;

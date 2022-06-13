import * as React from 'react';
import { css } from '@emotion/css';
import { parseAsString } from 'parse-dont-validate';
import { NonNullableAdonisAdmin } from '../../../../../auth';
import adonisAxios from '../../../../../axios';
import { isAllTextValid } from '../../../../../common/validation';
import { api } from '../../../../../util/const';
import { ToastError, ToastPromise } from '../../../toasify';
import { scrollbarStyle } from '../../handler/common';
import { ContentInput, DescriptionInput, TitleInput } from '../common';
import { NewPostButton } from './button';

const NewPost = ({
    onAddNewPost,
    admin,
}: Readonly<{
    onAddNewPost: () => void;
    admin: NonNullableAdonisAdmin;
}>) => {
    const [state, setState] = React.useState({
        title: '',
        description: '',
        content: '',
    });

    const { title, description, content } = state;

    return (
        <div
            className={css`
                padding: 8px 16px;
                box-sizing: border-box;
                overflow-y: auto;
                overflow-x: hidden;
                height: 100%;
                > input {
                    margin: 16px 0;
                }
                ${scrollbarStyle};
            `}
        >
            <TitleInput
                title={title}
                onTitleChange={(title) =>
                    setState((prev) => ({
                        ...prev,
                        title,
                    }))
                }
            />
            <DescriptionInput
                description={description}
                onDescriptionChange={(description) =>
                    setState((prev) => ({
                        ...prev,
                        description,
                    }))
                }
            />
            <ContentInput
                content={content}
                onContentChange={(content) =>
                    setState((prev) => ({
                        ...prev,
                        content,
                    }))
                }
            />
            <NewPostButton
                onAddNewPost={() => {
                    onAddNewPost();
                    if (!isAllTextValid(state)) {
                        ToastError('Invalid input');
                        return;
                    }
                    const promise = new Promise<string>((res) =>
                        admin
                            .getIdToken(true)
                            .then((token) =>
                                adonisAxios
                                    .post(api.admin.post.insert, {
                                        data: {
                                            post: {
                                                ...state,
                                            },
                                            token,
                                        },
                                    })
                                    .then(({ data }) => res(data.message))
                            )
                            .catch(ToastError)
                    );
                    ToastPromise({
                        promise,
                        pending: 'Adding new post...',
                        success: {
                            render: ({ data }) =>
                                parseAsString(data).orElseThrowDefault('data'),
                        },
                        error: {
                            render: () => ToastError('Failed to add new post'),
                        },
                    });
                }}
            />
        </div>
    );
};

export default NewPost;

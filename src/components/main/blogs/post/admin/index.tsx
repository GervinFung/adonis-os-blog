import { css } from '@emotion/css';
import { capitalize } from 'granula-string';
import { parseAsString } from 'parse-dont-validate';
import * as React from 'react';
import Select from 'react-select';
import { NonNullableAdonisAdmin } from '../../../../../auth';
import adonisAxios from '../../../../../axios';
import {
    AdminHandlePost as AdminHandlePostType,
    PostsQueryOption,
} from '../../../../../common/type/post';
import { api } from '../../../../../util/const';
import { ToastError, ToastPromise } from '../../../toasify';
import {
    ClosePreviewButton,
    PreviewButton,
    RevertButton,
    UpdateButton,
} from './button';
import blogParser from '../../../../../parser/blog';
import adminPropsParser from '../../../../../parser/admin';
import blogPropsParser from '../../../../../parser/blog';
import nullableToUndefinedPropsParser from '../../../../../parser/type';
import {
    ContentInput,
    DescriptionInput,
    PostUnavailable,
    ReadonlyPost,
    TitleInput,
} from '../common';
import { isAllTextValid } from '../../../../../common/validation';

type Data = Readonly<{
    updated: AdminHandlePostType;
    original: AdminHandlePostType;
}>;

type NameOfMutableData = 'title' | 'description' | 'content';

const AdminHandlePost = (
    props: Readonly<{
        id: string;
        scrollbarStyle: string;
        admin: NonNullableAdonisAdmin;
        queryOption: PostsQueryOption;
    }>
) => {
    const { id, scrollbarStyle, admin } = props;

    const [state, setState] = React.useState({
        data: undefined as Data | undefined,
        queryOption: props.queryOption,
        isPreview: false,
    });

    const { data, queryOption, isPreview } = state;

    React.useEffect(() => {
        const promise = new Promise<string>((res) =>
            admin
                .getIdToken(true)
                .then((token) =>
                    adonisAxios
                        .get(
                            `${api.admin.post.query}/${id}?token=${token}&type=${queryOption}`
                        )
                        .then(({ data }) => {
                            setState((prev) => {
                                const { one } = blogParser();

                                const { data: stateData } = prev;

                                const type =
                                    adminPropsParser().posts.parseAsPostQueryOption(
                                        data.type
                                    );

                                const postData = (() => {
                                    switch (type) {
                                        case 'published':
                                            return {
                                                type,
                                                post: one.parseAsPublishedPost(
                                                    data.post
                                                ),
                                            };
                                        case 'unpublished':
                                            return {
                                                type,
                                                post: one.parseAsUnpublishedPost(
                                                    data.post
                                                ),
                                            };
                                        case 'deleted':
                                            return {
                                                type,
                                                post: one.parseAsDeletedPost(
                                                    data.post
                                                ),
                                            };
                                    }
                                })();

                                const latestQuery = {
                                    updated: postData,
                                    original: postData,
                                };

                                return {
                                    ...prev,
                                    data: !stateData
                                        ? latestQuery
                                        : {
                                              ...stateData,
                                              ...latestQuery,
                                          },
                                };
                            });
                            res('Completed');
                        })
                        .catch(ToastError)
                )
                .catch(ToastError)
        );
        ToastPromise({
            promise,
            pending: 'Querying post...',
            success: {
                render: ({ data }) =>
                    parseAsString(data).orElseThrowDefault('data'),
            },
            error: {
                render: () => ToastError(`Failed to query post ${id}`),
            },
        });
    }, [queryOption]);

    if (!data) {
        return null;
    }
    const { updated, original } = data;

    const { type, post } = updated;

    if (!post) {
        return <PostUnavailable type={queryOption} />;
    }

    const { title, description, content } = post;

    const { parseAsNonNullable } = nullableToUndefinedPropsParser();

    const grayBorder = css`
        border: 1px solid gray;
    `;

    const onSubmit = (
        handlePostType: AdminHandlePostType,
        setState: () => void
    ) => {
        const { type } = handlePostType;
        const post = parseAsNonNullable(handlePostType.post);
        if (!isAllTextValid(post)) {
            ToastError('Invalid input');
            return;
        }
        const promise = new Promise<string>((res) =>
            admin
                .getIdToken(true)
                .then((token) =>
                    adonisAxios
                        .post(api.admin.post.update, {
                            data: {
                                post,
                                type,
                                token,
                            },
                        })
                        .then(({ data }) => res(data.message))
                )
                .catch(ToastError)
        );
        ToastPromise({
            promise,
            pending: 'Updating post...',
            success: {
                render: ({ data }) =>
                    parseAsString(data).orElseThrowDefault('data'),
            },
            error: {
                render: () => ToastError(`Failed to update post ${id}`),
            },
        });
        setState();
    };

    const getDiscriminatedUnionOfPost = (
        postType: AdminHandlePostType,
        {
            key,
            value,
        }: Readonly<{
            key: NameOfMutableData;
            value: string;
        }>
    ): AdminHandlePostType => {
        const { type } = postType;
        switch (type) {
            case 'published':
                return {
                    type,
                    post: {
                        ...parseAsNonNullable(postType.post),
                        [key]: value,
                    },
                };
            case 'unpublished':
                return {
                    type,
                    post: {
                        ...parseAsNonNullable(postType.post),
                        [key]: value,
                    },
                };
            case 'deleted':
                return {
                    type,
                    post: {
                        ...parseAsNonNullable(postType.post),
                        [key]: value,
                    },
                };
        }
    };

    const formOptionsForPost = () => {
        switch (type) {
            case 'deleted':
                return ['restore'] as const;

            case 'published':
                return ['unpublish', 'delete'] as const;

            case 'unpublished':
                return ['publish', 'delete'] as const;
        }
    };

    const value = {
        label: capitalize(queryOption) as string,
        value: queryOption as string,
    };

    return (
        <div
            className={css`
                padding: 8px 16px;
                box-sizing: border-box;
                overflow-y: auto;
                overflow-x: hidden;
                height: 100%;
                ${scrollbarStyle};
            `}
        >
            <Select
                defaultValue={value}
                value={value}
                placeholder="Update Post Status"
                maxMenuHeight={200}
                className={css`
                    margin: 0 0 16px 0;
                    > div {
                        background-color: #e6e6e6;
                        ${grayBorder}
                        :hover {
                            ${grayBorder}
                        }
                    }
                `}
                options={formOptionsForPost().map((option) => ({
                    label: capitalize(option),
                    value: option,
                }))}
                onChange={(option) => {
                    const { one } = blogPropsParser();
                    const type = one.parseAsUpdatePostStatus(option?.value);
                    const promise = new Promise<string>((res) =>
                        admin
                            .getIdToken(true)
                            .then((token) =>
                                adonisAxios
                                    .post(`${api.admin.post[type]}/${id}`, {
                                        data: {
                                            id,
                                            type,
                                            token,
                                        },
                                    })
                                    .then(({ data }) => res(data.message))
                            )
                            .catch(ToastError)
                    );
                    ToastPromise({
                        promise,
                        pending: 'Updating post...',
                        success: {
                            render: ({ data }) =>
                                parseAsString(data).orElseThrowDefault('data'),
                        },
                        error: {
                            render: () => ToastError(`Failed to update ${id}`),
                        },
                    });
                    setState((prev) => ({
                        ...prev,
                        queryOption: (() => {
                            switch (type) {
                                case 'delete':
                                    return 'deleted';
                                case 'publish':
                                    return 'published';
                                case 'unpublish':
                                case 'restore':
                                    return 'unpublished';
                            }
                        })(),
                    }));
                }}
            />
            {isPreview ? (
                <ReadonlyPost
                    blackColor={css`
                        color: #121212;
                    `}
                    scrollbarStyle={scrollbarStyle}
                    post={{
                        title: parseAsNonNullable(updated.post?.title),
                        content: parseAsNonNullable(updated.post?.content),
                        description: parseAsNonNullable(
                            updated.post?.description
                        ),
                        timePublished: new Date(),
                    }}
                />
            ) : (
                <>
                    <TitleInput
                        title={title}
                        onTitleChange={(title) =>
                            setState((prev) => {
                                const query = parseAsNonNullable(prev.data);
                                const { updated } = query;
                                return {
                                    ...prev,
                                    data: {
                                        ...query,
                                        updated: {
                                            ...updated,
                                            ...getDiscriminatedUnionOfPost(
                                                updated,
                                                {
                                                    key: 'title',
                                                    value: title,
                                                }
                                            ),
                                        },
                                    },
                                };
                            })
                        }
                    />
                    <p>
                        {`${capitalize(type)} on ${
                            type === 'published'
                                ? parseAsNonNullable(
                                      post
                                  ).timePublished.toDateString()
                                : type === 'unpublished'
                                ? parseAsNonNullable(
                                      post
                                  ).timeCreated.toDateString()
                                : parseAsNonNullable(
                                      post
                                  ).timeDeleted.toDateString()
                        }`}
                    </p>
                    <DescriptionInput
                        description={description}
                        onDescriptionChange={(description) =>
                            setState((prev) => {
                                const query = parseAsNonNullable(prev.data);
                                const { updated } = query;
                                return {
                                    ...prev,
                                    data: {
                                        ...query,
                                        updated: {
                                            ...updated,
                                            ...getDiscriminatedUnionOfPost(
                                                updated,
                                                {
                                                    key: 'description',
                                                    value: description,
                                                }
                                            ),
                                        },
                                    },
                                };
                            })
                        }
                    />
                    <ContentInput
                        content={content}
                        onContentChange={(content) =>
                            setState((prev) => {
                                const query = parseAsNonNullable(prev.data);
                                const { updated } = query;
                                return {
                                    ...prev,
                                    data: {
                                        ...query,
                                        updated: {
                                            ...updated,
                                            ...getDiscriminatedUnionOfPost(
                                                updated,
                                                {
                                                    key: 'content',
                                                    value: content,
                                                }
                                            ),
                                        },
                                    },
                                };
                            })
                        }
                    />
                </>
            )}
            <div
                className={css`
                    width: 100%;
                    display: flex;
                    justify-content: center;
                `}
            >
                {isPreview ? (
                    <ClosePreviewButton
                        onClosePreview={() =>
                            setState((prev) => ({
                                ...prev,
                                isPreview: false,
                            }))
                        }
                    />
                ) : (
                    <PreviewButton
                        onPreview={() =>
                            setState((prev) => ({
                                ...prev,
                                isPreview: true,
                            }))
                        }
                    />
                )}
            </div>
            <div
                className={css`
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                `}
            >
                <RevertButton
                    onRevert={() =>
                        onSubmit(original, () =>
                            setState((prev) => {
                                const { data: query } = prev;
                                if (!query) {
                                    throw new Error('Query must be defined');
                                }
                                return {
                                    ...prev,
                                    data: {
                                        ...query,
                                        updated: query.original,
                                    },
                                };
                            })
                        )
                    }
                />
                <UpdateButton
                    onUpdate={() =>
                        onSubmit(updated, () =>
                            setState((prev) => {
                                const { data: query } = prev;
                                if (!query) {
                                    throw new Error('Query must be defined');
                                }
                                return {
                                    ...prev,
                                    data: {
                                        ...query,
                                        orignal: query.updated,
                                    },
                                };
                            })
                        )
                    }
                />
            </div>
        </div>
    );
};

export default AdminHandlePost;

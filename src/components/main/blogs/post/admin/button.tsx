import { css } from '@emotion/css';
import * as React from 'react';
import Button from '../../../common/button';

const EditButton = ({
    onClick,
    name,
}: Readonly<{
    onClick: () => void;
    name: string;
}>) => (
    <Button
        name={name}
        onClick={onClick}
        containerClassName={css`
            border: none;
            background-color: transparent;
            padding: 0;
            margin: 16px 0;
        `}
    />
);

const UnpublishButton = ({
    onUnpublish,
}: Readonly<{
    onUnpublish: () => void;
}>) => <EditButton name="Unpublish" onClick={onUnpublish} />;

const PublishButton = ({
    onPublish,
}: Readonly<{
    onPublish: () => void;
}>) => <EditButton name="Publish" onClick={onPublish} />;

const UpdateButton = ({
    onUpdate,
}: Readonly<{
    onUpdate: () => void;
}>) => <EditButton name="Update" onClick={onUpdate} />;

const RevertButton = ({
    onRevert,
}: Readonly<{
    onRevert: () => void;
}>) => <EditButton name="Revert" onClick={onRevert} />;

const PreviewButton = ({
    onPreview,
}: Readonly<{
    onPreview: () => void;
}>) => <EditButton name="Preview" onClick={onPreview} />;

const NewPostButton = ({
    onAddNewPost,
}: Readonly<{
    onAddNewPost: () => void;
}>) => <EditButton name="Add New Post" onClick={onAddNewPost} />;

const ClosePreviewButton = ({
    onClosePreview,
}: Readonly<{
    onClosePreview: () => void;
}>) => <EditButton name="Close Preview" onClick={onClosePreview} />;

export {
    EditButton,
    UnpublishButton,
    PublishButton,
    UpdateButton,
    RevertButton,
    PreviewButton,
    NewPostButton,
    ClosePreviewButton,
};

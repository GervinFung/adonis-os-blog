import { css } from '@emotion/css';
import * as React from 'react';
import ReactDraggable from 'react-draggable';
import { Position } from '.';

const Draggable = ({
    children,
    isFullHeight,
    setPosition,
}: Readonly<{
    children: React.ReactNode;
    isFullHeight: boolean;
    setPosition: (position: Position) => void;
}>) =>
    isFullHeight ? (
        <>{children}</>
    ) : (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        //ref : https://lo-victoria.com/making-draggable-components-in-react to make it draggable
        <ReactDraggable
            defaultClassName={css`
                height: fit-content;
            `}
            onDrag={(_, { x, y }) => setPosition({ x, y })}
        >
            {children}
        </ReactDraggable>
    );

export default Draggable;

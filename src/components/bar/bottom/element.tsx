import * as React from 'react';
import { css } from '@emotion/css';
import Link from 'next/link';

const Icon = ({
    imgName,
    isActive,
}: Readonly<{
    imgName: string;
    isActive: boolean;
}>) => (
    <div
        className={css`
            display: grid;
            place-items: center;
        `}
    >
        <img
            src={`images/bar/${imgName}.webp`}
            alt={imgName}
            className={css`
                width: 35px;
                height: auto;
                cursor: pointer;
                transition: all 0.3s ease;
                :hover {
                    transform: rotate(-360deg) scale(1.15);
                }
            `}
        />
        <div
            className={css`
                border-radius: 50%;
                width: 2px;
                height: 2px;
                margin: 8px 0 0 0;
                padding: 1px;
                background-color: ${isActive ? '#cf352e' : 'transparent'};
            `}
        ></div>
    </div>
);

const Element = ({
    imgName,
    action,
    isActive,
}: Readonly<{
    imgName: string;
    isActive: boolean;
    action: Readonly<
        | {
              type: 'link';
              href: string;
          }
        | {
              type: 'button';
              onClick: () => void;
          }
    >;
}>) => {
    const ImageIcon = () => <Icon imgName={imgName} isActive={isActive} />;

    const ClickableElement = () => {
        switch (action.type) {
            case 'link': {
                const { href } = action;
                return href.startsWith('/') ? (
                    <Link href={href} passHref={true}>
                        <ImageIcon />
                    </Link>
                ) : (
                    <a
                        href={href}
                        target="_blank"
                        rel="external nofollow noopener noreferrer"
                    >
                        <ImageIcon />
                    </a>
                );
            }
            case 'button': {
                const { onClick } = action;
                return (
                    <div onClick={onClick}>
                        <ImageIcon />
                    </div>
                );
            }
        }
    };

    return (
        <div
            className={css`
                padding: 8px 16px;
            `}
        >
            <ClickableElement />
        </div>
    );
};

export default Element;

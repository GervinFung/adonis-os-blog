import { css } from '@emotion/css';
import Head from 'next/head';
import * as React from 'react';
import BottomBar from '../bar/bottom';
import TopBar from '../bar/top';
import { JetbrainMono } from '../common/font';

const Layout = ({
    children,
    title,
}: Readonly<{
    children: React.ReactNode;
    title: string;
}>) => {
    const min = 0;
    const max = 3;

    const [state, setState] = React.useState({
        backgroundImageIndex: min,
    });

    const { backgroundImageIndex } = state;

    React.useEffect(() => {
        if (max - min <= 1) {
            return;
        }
        const interval = setInterval(() => {
            setState((prev) => ({
                ...prev,
                backgroundImageIndex: Math.floor(
                    Math.random() *
                        Array.from({ length: max }, (_, i) => i + 1).filter(
                            (i) => i !== backgroundImageIndex
                        ).length
                ),
            }));
        }, 1000 * 60);
        return () => {
            interval;
        };
    }, []);

    return (
        <div
            className={css`
                width: 100%;
                height: 100vh;
                font-family: 'JetBrains Mono', monospace !important;
                font-size: 0.8em;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                background-image: url('images/background/background-${backgroundImageIndex}.webp');
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                transition: all ease-in-out 0.1s;
                overflow: hidden;
                * {
                    font-family: 'JetBrains Mono', monospace !important;
                }
            `}
        >
            <Head>
                <title>{title}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="shortcut icon" href="images/icon/favicon.ico" />
            </Head>
            <JetbrainMono />
            <TopBar />
            {children}
            <BottomBar />
        </div>
    );
};

export default Layout;

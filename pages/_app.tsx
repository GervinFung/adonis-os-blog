import * as React from 'react';
import type { AppProps } from 'next/app';
import Layout from '../src/components/layout';

type Settings = Readonly<{
    isOpen: boolean;
    isVisible: boolean;
    zIndex: 0 | 1;
    setIsOpen: (isOpen: boolean) => void;
    setIsVisible: (isVisible: boolean) => void;
    setZIndex: () => void;
}>;

const AppContext = React.createContext(
    (() => {
        const defaultSettings = {
            isOpen: false,
            isVisible: false,
            zIndex: 0,
            setIsOpen: (_: boolean) => {},
            setIsVisible: (_: boolean) => {},
            setZIndex: () => {},
        } as Settings;
        return {
            terminalSettings: defaultSettings,
            blogsSettings: {
                ...defaultSettings,
                zIndex: 1,
            } as Settings,
        };
    })()
);

const App = ({ Component, pageProps }: AppProps) => {
    const [state, setState] = React.useState(React.useContext(AppContext));

    const setIsVisible =
        (settingsName: 'terminalSettings' | 'blogsSettings') =>
        (isVisible: boolean) =>
            setState((prev) => {
                const settings = prev[settingsName];
                const oppositeSettingsName =
                    settingsName === 'blogsSettings'
                        ? 'terminalSettings'
                        : 'blogsSettings';
                const oppositeSettings = prev[oppositeSettingsName];
                const isOnTopOfAnotherElement =
                    settings.zIndex > oppositeSettings.zIndex;
                return {
                    ...prev,
                    [settingsName]: {
                        ...settings,
                        isVisible,
                        zIndex: isOnTopOfAnotherElement
                            ? settings.zIndex
                            : oppositeSettings.zIndex,
                    },
                    [oppositeSettingsName]: {
                        ...oppositeSettings,
                        zIndex: isOnTopOfAnotherElement
                            ? oppositeSettings.zIndex
                            : settings.zIndex,
                    },
                };
            });

    const setIsOpen =
        (settingsName: 'terminalSettings' | 'blogsSettings') =>
        (isOpen: boolean) =>
            setState((prev) => {
                const settings = prev[settingsName];
                const oppositeSettingsName =
                    settingsName === 'blogsSettings'
                        ? 'terminalSettings'
                        : 'blogsSettings';
                const oppositeSettings = prev[oppositeSettingsName];
                const isOnTopOfAnotherElement =
                    settings.zIndex > oppositeSettings.zIndex;
                return {
                    ...prev,
                    [settingsName]: {
                        ...settings,
                        isOpen,
                        zIndex: isOnTopOfAnotherElement
                            ? settings.zIndex
                            : oppositeSettings.zIndex,
                    },
                    [oppositeSettingsName]: {
                        ...oppositeSettings,
                        zIndex: isOnTopOfAnotherElement
                            ? oppositeSettings.zIndex
                            : settings.zIndex,
                    },
                };
            });

    const setZIndex =
        (settingsName: 'terminalSettings' | 'blogsSettings') => () =>
            setState((prev) => {
                const settings = prev[settingsName];
                const oppositeSettingsName =
                    settingsName === 'blogsSettings'
                        ? 'terminalSettings'
                        : 'blogsSettings';
                const oppositeSettings = prev[oppositeSettingsName];
                const isOnTopOfAnotherElement =
                    settings.zIndex > oppositeSettings.zIndex;
                return {
                    ...prev,
                    [settingsName]: {
                        ...settings,
                        zIndex: isOnTopOfAnotherElement
                            ? settings.zIndex
                            : oppositeSettings.zIndex,
                    },
                    [oppositeSettingsName]: {
                        ...oppositeSettings,
                        zIndex: isOnTopOfAnotherElement
                            ? oppositeSettings.zIndex
                            : settings.zIndex,
                    },
                };
            });

    return (
        <AppContext.Provider
            value={{
                ...state,
                terminalSettings: {
                    ...state.terminalSettings,
                    setIsOpen: setIsOpen('terminalSettings'),
                    setIsVisible: setIsVisible('terminalSettings'),
                    setZIndex: setZIndex('terminalSettings'),
                },
                blogsSettings: {
                    ...state.blogsSettings,
                    setIsOpen: setIsOpen('blogsSettings'),
                    setIsVisible: setIsVisible('blogsSettings'),
                    setZIndex: setZIndex('blogsSettings'),
                },
            }}
        >
            <Layout title="Adonis OS Blog">
                <Component {...pageProps} />
            </Layout>
        </AppContext.Provider>
    );
};

export { AppContext };
export type { Settings };

export default App;

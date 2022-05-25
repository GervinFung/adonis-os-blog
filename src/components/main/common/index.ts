const defaultDimension = {
    height: 'fit-content',
    width: '50%',
} as const;

const defaultPosition = {
    x: 0,
    y: 0,
} as const;

type Position = Readonly<{
    x: number;
    y: number;
}>;

type Dimension = Readonly<{
    height: string;
    width: string;
}>;

const isFullHeightFunc = (height: string, maxHeight: string) =>
    height === maxHeight;

const commonState = {
    ...defaultDimension,
    position: {
        latest: {
            ...defaultPosition,
        } as Position,
        previous: {
            ...defaultPosition,
        } as Position,
    },
} as Readonly<{
    height: string;
    width: string;
    position: Readonly<{
        latest: Position;
        previous: Position;
    }>;
}>;

export { defaultPosition, defaultDimension, isFullHeightFunc, commonState };
export type { Position, Dimension };

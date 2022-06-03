type Item = Readonly<
    | {
          type: 'paginated';
          page: number;
      }
    | {
          type: 'one';
          id: string;
      }
>;

type Stack = ReadonlyArray<Item>;

type History = Readonly<{
    current: () => Item | undefined;
    stack: Stack;
    indexNavigation: number;
    isBackwardNavigatable: boolean;
    isForwardNavigatable: boolean;
    incrementIndex: () => History;
    decrementIndex: () => History;
    forward: () => History;
    backward: () => History;
    push: (item: Item) => History;
}>;

const initialIndexNavigation = -1;

// stack
const createHistory = ({
    stack,
    indexNavigation,
}: Readonly<{
    stack: Stack;
    indexNavigation: number;
}>): History => {
    // pre-caution to ensure both condition must be fulfilled as it cannot violate each other
    const isStackEmpty = !stack.length;
    if (isStackEmpty) {
        if (indexNavigation > initialIndexNavigation) {
            throw new Error(
                `\nBoth condition violated for creating history\n1. Stack has ${stack.length} item(s)\n2. Index for navigation is ${indexNavigation}`
            );
        }
    } else {
        if (indexNavigation === initialIndexNavigation) {
            throw new Error(
                `\nBoth condition violated for creating history\n1. Stack has ${stack.length} item(s)\n2. Index for navigation is ${indexNavigation}`
            );
        }
    }

    const incrementIndex = () =>
        createHistory({
            stack,
            indexNavigation: indexNavigation + 1,
        });

    const decrementIndex = () =>
        createHistory({
            stack,
            indexNavigation: indexNavigation - 1,
        });

    const current = () => stack[indexNavigation];

    const sameHistory = () => createHistory({ stack, indexNavigation });

    const { length } = stack;

    const isBackwardNavigatable = indexNavigation > 0;
    const isForwardNavigatable = indexNavigation < length - 1;

    return {
        current,
        stack,
        indexNavigation,
        isBackwardNavigatable,
        isForwardNavigatable,
        incrementIndex,
        decrementIndex,
        backward: () =>
            isBackwardNavigatable ? decrementIndex() : sameHistory(),
        forward: () =>
            isForwardNavigatable ? incrementIndex() : sameHistory(),
        push: (item: Item) => {
            if (indexNavigation > length) {
                throw new Error(
                    `incrementIndex: ${incrementIndex} cannot be larger than stack length: ${stack.length}`
                );
            } else if (indexNavigation === length) {
                return createHistory({
                    stack: stack.concat(item),
                    indexNavigation: indexNavigation + 1,
                });
            }
            return createHistory({
                indexNavigation: indexNavigation + 1,
                stack: stack
                    .filter((_, index) => index <= indexNavigation)
                    .concat(item),
            });
        },
    } as const;
};

const createInitialHistory = () =>
    createHistory({
        stack: [],
        indexNavigation: initialIndexNavigation,
    });

export { createInitialHistory, createHistory };
export type { Item, Stack, History };

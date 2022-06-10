import { PostsQueryOption } from '../common/type/post';

type UserItem = Readonly<
    | {
          type: 'paginated';
          page: number;
      }
    | {
          type: 'one';
          id: string;
      }
>;

type AdminItem = Readonly<
    | {
          type: 'paginated';
          queryOption: PostsQueryOption;
          page: number;
      }
    | {
          type: 'one';
          queryOption: PostsQueryOption;
          id: string;
      }
>;

type Stack<T> = ReadonlyArray<T>;

type UserStack = Stack<UserItem>;
type UserHistory = Readonly<{
    current: () => UserItem | undefined;
    stack: UserStack;
    indexNavigation: number;
    isBackwardNavigatable: boolean;
    isForwardNavigatable: boolean;
    incrementIndex: () => UserHistory;
    decrementIndex: () => UserHistory;
    forward: () => UserHistory;
    backward: () => UserHistory;
    push: (item: UserItem) => UserHistory;
}>;

type AdminStack = Stack<AdminItem>;
type AdminHistory = Readonly<{
    current: () => AdminItem | undefined;
    stack: UserStack;
    indexNavigation: number;
    isBackwardNavigatable: boolean;
    isForwardNavigatable: boolean;
    incrementIndex: () => AdminHistory;
    decrementIndex: () => AdminHistory;
    forward: () => AdminHistory;
    backward: () => AdminHistory;
    push: (item: AdminItem) => AdminHistory;
}>;

const initialIndexNavigation = -1;

const defaultValue = <T>() => ({
    stack: [] as Stack<T>,
    indexNavigation: initialIndexNavigation,
});

const checkForInvalidStackAndIndexNavigation = <T>(
    stack: Stack<T>,
    indexNavigation: number
) => {
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
};

const isNavigatable = ({
    indexNavigation,
    length,
}: Readonly<{
    indexNavigation: number;
    length: number;
}>) => ({
    isForwardNavigatable: indexNavigation < length - 1,
    isBackwardNavigatable: indexNavigation > 0,
});

const generateNewHistory = <T>({
    condition,
    valueIfFulfilled,
    valueIfNotFulfilled,
}: Readonly<{
    condition: boolean;
    valueIfFulfilled: () => T;
    valueIfNotFulfilled: () => T;
}>) => (condition ? valueIfFulfilled() : valueIfNotFulfilled());

// stack
const createAdminHistory = ({
    stack,
    indexNavigation,
}: Readonly<{
    stack: AdminStack;
    indexNavigation: number;
}>): AdminHistory => {
    checkForInvalidStackAndIndexNavigation(stack, indexNavigation);

    const incrementIndex = () =>
        createAdminHistory({
            stack,
            indexNavigation: indexNavigation + 1,
        });

    const decrementIndex = () =>
        createAdminHistory({
            stack,
            indexNavigation: indexNavigation - 1,
        });

    const current = () => stack[indexNavigation];

    const sameHistory = () => createAdminHistory({ stack, indexNavigation });

    const { length } = stack;

    const { isBackwardNavigatable, isForwardNavigatable } = isNavigatable({
        indexNavigation,
        length,
    });

    return {
        current,
        stack,
        indexNavigation,
        isBackwardNavigatable,
        isForwardNavigatable,
        incrementIndex,
        decrementIndex,
        backward: () =>
            generateNewHistory({
                condition: isBackwardNavigatable,
                valueIfFulfilled: () => decrementIndex(),
                valueIfNotFulfilled: () => sameHistory(),
            }),
        forward: () =>
            generateNewHistory({
                condition: isForwardNavigatable,
                valueIfFulfilled: () => incrementIndex(),
                valueIfNotFulfilled: () => sameHistory(),
            }),
        push: (item: AdminItem) => {
            if (indexNavigation > length) {
                throw new Error(
                    `incrementIndex: ${incrementIndex} cannot be larger than stack length: ${stack.length}`
                );
            } else if (indexNavigation === length) {
                return createAdminHistory({
                    stack: stack.concat(item),
                    indexNavigation: indexNavigation + 1,
                });
            }
            return createAdminHistory({
                indexNavigation: indexNavigation + 1,
                stack: stack
                    .filter((_, index) => index <= indexNavigation)
                    .concat(item),
            });
        },
    };
};

const createUserHistory = ({
    stack,
    indexNavigation,
}: Readonly<{
    stack: UserStack;
    indexNavigation: number;
}>): UserHistory => {
    checkForInvalidStackAndIndexNavigation(stack, indexNavigation);

    const incrementIndex = () =>
        createUserHistory({
            stack,
            indexNavigation: indexNavigation + 1,
        });

    const decrementIndex = () =>
        createUserHistory({
            stack,
            indexNavigation: indexNavigation - 1,
        });

    const current = () => stack[indexNavigation];

    const sameHistory = () => createUserHistory({ stack, indexNavigation });

    const { length } = stack;

    const { isBackwardNavigatable, isForwardNavigatable } = isNavigatable({
        indexNavigation,
        length,
    });

    return {
        current,
        stack,
        indexNavigation,
        isBackwardNavigatable,
        isForwardNavigatable,
        incrementIndex,
        decrementIndex,
        backward: () =>
            generateNewHistory({
                condition: isBackwardNavigatable,
                valueIfFulfilled: () => decrementIndex(),
                valueIfNotFulfilled: () => sameHistory(),
            }),
        forward: () =>
            generateNewHistory({
                condition: isForwardNavigatable,
                valueIfFulfilled: () => incrementIndex(),
                valueIfNotFulfilled: () => sameHistory(),
            }),
        push: (item: UserItem) => {
            if (indexNavigation > length) {
                throw new Error(
                    `incrementIndex: ${incrementIndex} cannot be larger than stack length: ${stack.length}`
                );
            } else if (indexNavigation === length) {
                return createUserHistory({
                    stack: stack.concat(item),
                    indexNavigation: indexNavigation + 1,
                });
            }
            return createUserHistory({
                indexNavigation: indexNavigation + 1,
                stack: stack
                    .filter((_, index) => index <= indexNavigation)
                    .concat(item),
            });
        },
    };
};

const createInitialAdminHistory = () => createAdminHistory(defaultValue());
const createInitialUserHistory = () => createUserHistory(defaultValue());

export {
    createInitialUserHistory,
    createUserHistory,
    createInitialAdminHistory,
    createAdminHistory,
};
export type {
    UserItem,
    UserHistory,
    UserStack,
    AdminItem,
    AdminHistory,
    AdminStack,
};

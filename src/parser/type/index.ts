const nullableToUndefinedPropsParser = () => {
    const parseValue = <T>(t: T | null | undefined) => t ?? undefined;
    return {
        parseValue,
        parseObject: <T extends Object>(obj: T) =>
            Object.entries(obj).reduce(
                (prev, [key, value]) => ({ ...prev, [key]: parseValue(value) }),
                {}
            ),
        parseAsNonNullable: <T>(t: T): NonNullable<T> => {
            if (!t) {
                throw new Error('T must be defined');
            }
            return t as NonNullable<T>;
        },
    } as const;
};

export default nullableToUndefinedPropsParser;

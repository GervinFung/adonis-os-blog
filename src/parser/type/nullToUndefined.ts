const parseNullableAsDefaultOrUndefined = <T>(t: T | null | undefined) =>
    t ?? undefined;

export default parseNullableAsDefaultOrUndefined;

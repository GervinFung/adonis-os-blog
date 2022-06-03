import { parseAsString } from 'parse-dont-validate';

const adminAuthParser = () => {
    const parseStringElseUndefined = (string: unknown) =>
        parseAsString(string).orElseGetUndefined();
    return {
        parseAsToken: (token: unknown) => parseStringElseUndefined(token),
    } as const;
};

export default adminAuthParser;

import { parseAsNumber } from 'parse-dont-validate';

const parseAsIndexNavigation = (
    json: string | undefined,
    alternativeValue: number
): number =>
    !json
        ? alternativeValue
        : parseAsNumber(JSON.parse(json)).orElseGet(alternativeValue);

export default parseAsIndexNavigation;

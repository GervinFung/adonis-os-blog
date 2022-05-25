import { parseAsNumber, parseAsString } from 'parse-dont-validate';

const min = 1;

const parseAsPage = (page: unknown) =>
    parseAsNumber(parseInt(parseAsString(page).orElseLazyGet(() => `${min}`)))
        .inRangeOf(min, Number.MAX_SAFE_INTEGER)
        .orElseLazyGet(() => min);

export default parseAsPage;

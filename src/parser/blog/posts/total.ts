import { parseAsNumber } from 'parse-dont-validate';

const min = 0;

const parseAsTotalPosts = (page: unknown) =>
    parseAsNumber(page)
        .inRangeOf(min, Number.MAX_SAFE_INTEGER)
        .orElseLazyGet(() => min);

export default parseAsTotalPosts;

import {
    parseAsCustomType,
    parseAsNumber,
    parseAsReadonlyArray,
    parseAsString,
} from 'parse-dont-validate';
import { Item, Stack } from '../../history';
import { val } from '../../util/const';

const maxLength = 100;

const parseAsStack = (json: string | undefined): Stack => {
    if (!json) {
        return [];
    }
    const stack = parseAsReadonlyArray(JSON.parse(json), (item) => {
        const type = parseAsCustomType<Item['type']>(
            item.type,
            (type) => type === val.posts || type === val.post
        ).orElseGetUndefined();
        switch (type) {
            case undefined:
                return [];
            case 'post': {
                const id = parseAsString(item.id).orElseGetUndefined();
                return !id
                    ? []
                    : [
                          {
                              type,
                              id,
                          } as const,
                      ];
            }
            case 'posts': {
                const page = parseAsNumber(item.page).orElseGetUndefined();
                return !page
                    ? []
                    : [
                          {
                              type,
                              page,
                          } as const,
                      ];
            }
        }
    })
        .orElseGetReadonlyEmptyArray()
        .flat();
    return stack.length <= maxLength
        ? stack
        : stack.slice(Math.max(stack.length - maxLength));
};

export { maxLength };
export default parseAsStack;

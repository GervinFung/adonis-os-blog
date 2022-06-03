import {
    parseAsCustomType,
    parseAsNumber,
    parseAsReadonlyArray,
    parseAsString,
} from 'parse-dont-validate';
import { Item, Stack } from '../../history';
import { val } from '../../util/const';

const maxLength = 100;

const historyPropsParser = () =>
    ({
        parseAsIndexNavigation: (
            json: string | undefined,
            alternativeValue: number
        ): number =>
            !json
                ? alternativeValue
                : parseAsNumber(JSON.parse(json)).orElseGet(alternativeValue),
        parseAsStack: (json: string | undefined): Stack => {
            if (!json) {
                return [];
            }
            const stack = parseAsReadonlyArray(JSON.parse(json), (item) => {
                const { paginated, one } = val.post;
                const type = parseAsCustomType<Item['type']>(
                    item.type,
                    (type) =>
                        type === paginated.replace('post/', '') ||
                        type === one.replace('post/', '')
                ).orElseGetUndefined();
                switch (type) {
                    case undefined:
                        return [];
                    case 'one': {
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
                    case 'paginated': {
                        const page = parseAsNumber(
                            item.page
                        ).orElseGetUndefined();
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
        },
    } as const);

export { maxLength };
export default historyPropsParser;

import {
    parseAsCustomType,
    parseAsNumber,
    parseAsReadonlyArray,
    parseAsString,
} from 'parse-dont-validate';
import { PostsQueryOption } from '../../common/type/post';
import { AdminItem, AdminStack, UserItem, UserStack } from '../../history';
import { admin, val } from '../../util/const';

const maxLength = 100;

const historyPropsParser = () => {
    const prune = <T>(stack: ReadonlyArray<T>) =>
        stack.length <= maxLength
            ? stack
            : stack.slice(Math.max(stack.length - maxLength));

    return {
        parseAsIndexNavigation: (
            json: string | undefined,
            alternativeValue: number
        ): number =>
            !json
                ? alternativeValue
                : parseAsNumber(JSON.parse(json)).orElseGet(alternativeValue),
        parseAsAdminStack: (json: string | undefined): AdminStack =>
            prune(
                !json
                    ? []
                    : parseAsReadonlyArray(JSON.parse(json), (item) => {
                          const { paginated, one } = val.post;
                          const queryOption =
                              parseAsCustomType<PostsQueryOption>(
                                  item.queryOption,
                                  (queryOption) =>
                                      admin.postQueryOptions.includes(
                                          queryOption
                                      )
                              ).orElseThrowDefault('queryOption');
                          const type = parseAsCustomType<AdminItem['type']>(
                              item.type,
                              (type) =>
                                  type === paginated.replace('post/', '') ||
                                  type === one.replace('post/', '')
                          ).orElseThrowDefault('type');
                          switch (type) {
                              case 'one': {
                                  const id = parseAsString(
                                      item.id
                                  ).orElseGetUndefined();
                                  return !id
                                      ? []
                                      : [
                                            {
                                                type,
                                                id,
                                                queryOption,
                                            },
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
                                                queryOption,
                                            },
                                        ];
                              }
                          }
                      })
                          .orElseGetReadonlyEmptyArray()
                          .flat()
            ),
        parseAsUserStack: (json: string | undefined): UserStack =>
            prune(
                !json
                    ? []
                    : parseAsReadonlyArray(JSON.parse(json), (item) => {
                          const { paginated, one } = val.post;
                          const type = parseAsCustomType<UserItem['type']>(
                              item.type,
                              (type) =>
                                  type === paginated.replace('post/', '') ||
                                  type === one.replace('post/', '')
                          ).orElseGetUndefined();
                          switch (type) {
                              case undefined:
                                  return [];
                              case 'one': {
                                  const id = parseAsString(
                                      item.id
                                  ).orElseGetUndefined();
                                  return !id
                                      ? []
                                      : [
                                            {
                                                type,
                                                id,
                                            },
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
                                            },
                                        ];
                              }
                          }
                      })
                          .orElseGetReadonlyEmptyArray()
                          .flat()
            ),
    } as const;
};

export { maxLength };
export default historyPropsParser;

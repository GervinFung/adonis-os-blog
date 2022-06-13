import { TestCases } from '.';
import { UserStack } from '../../../../src/history';
import historyParser from '../../../../src/parser/history';

const testUserStackParser = ({
    parsingFailTestCase,
    parsePruneStackIfExceedLength,
}: TestCases<UserStack>) =>
    describe('User', () => {
        const { parseAsUserStack } = historyParser();
        parsingFailTestCase((json) => parseAsUserStack(json));
        parsePruneStackIfExceedLength((maxLength) => {
            const pruneItem = { type: 'paginated', page: 1 };
            const keepItem = { type: 'paginated', page: 2 };
            const pruneLength = 20;
            return parseAsUserStack(
                JSON.stringify(
                    Array.from(
                        { length: maxLength + pruneLength },
                        (_, index) =>
                            index < pruneLength ? pruneItem : keepItem
                    )
                )
            );
        });
        it('should parse stack and not include invalid element', () => {
            const stack = [
                { type: 'paginated', page: 1 },
                { type: 'paginated', page: 2 },
                { type: undefined, posts: 3 },
                { type: 'one', id: '123' },
                { type: undefined, post: 'undefined' },
                // invalid item
                { type: 'one', posts: 'undefined' },
                { type: 'one', id: 1 },
                { type: 'paginated', post: 'undefined' },
                { type: 'paginated', page: '1' },
            ] as const;
            expect(parseAsUserStack(JSON.stringify(stack))).toStrictEqual(
                stack.filter(({ type }, index) => index <= 4 && type)
            );
        });
    });

export default testUserStackParser;

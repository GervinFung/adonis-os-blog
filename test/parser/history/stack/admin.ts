import { TestCases } from '.';
import { AdminStack } from '../../../../src/history';
import historyParser from '../../../../src/parser/history';

const testAdminStackParser = ({
    parsingFailTestCase,
    parsePruneStackIfExceedLength,
}: TestCases<AdminStack>) =>
    describe('Admin', () => {
        const { parseAsAdminStack } = historyParser();
        parsingFailTestCase((json) => parseAsAdminStack(json));
        parsePruneStackIfExceedLength((maxLength) => {
            const pruneItem = {
                type: 'paginated',
                queryOption: 'published',
                page: 1,
            };
            const keepItem = {
                type: 'paginated',
                queryOption: 'published',
                page: 2,
            };
            const pruneLength = 20;
            return parseAsAdminStack(
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
                { type: 'paginated', queryOption: 'published', page: 1 },
                { type: 'paginated', queryOption: 'unpublished', page: 2 },
                { type: 'one', queryOption: 'deleted', id: '123' },
                { type: 'one', queryOption: 'published', id: '1234' },
            ] as const;
            expect(parseAsAdminStack(JSON.stringify(stack))).toStrictEqual(
                stack.filter(({ type }, index) => index <= 4 && type)
            );
        });
        it('should fail to parse stack and throw error', () => {
            expect(() =>
                parseAsAdminStack(
                    JSON.stringify([{ type: 'paginated', page: 1 }])
                )
            ).toThrowError();
            expect(() =>
                parseAsAdminStack(
                    JSON.stringify([{ queryOption: 'published', page: 1 }])
                )
            ).toThrowError();
            expect(() =>
                parseAsAdminStack(
                    JSON.stringify([
                        {
                            type: 'paginated',
                            queryOption: 'undefined',
                            page: 1,
                        },
                    ])
                )
            ).toThrowError();
            expect(() =>
                parseAsAdminStack(
                    JSON.stringify([
                        { type: 'whatever', queryOption: 'published', page: 1 },
                    ])
                )
            ).toThrowError();
        });
    });

export default testAdminStackParser;

import testAdminStackParser from './admin';
import testUserStackParser from './user';
import { maxLength } from '../../../../src/parser/history';

type TestCases<T extends ReadonlyArray<any>> = Readonly<{
    parsingFailTestCase: (parse: (json: string | undefined) => T) => void;
    parsePruneStackIfExceedLength: (
        parse: (max: typeof maxLength) => T
    ) => void;
}>;

const testStackParser = () =>
    describe('Stack Parser', () => {
        const generateTestCases = <T>(): TestCases<ReadonlyArray<T>> => ({
            parsingFailTestCase: (parse) =>
                it('should failed to parse stack and return empty array as stack is not array', () => {
                    expect(parse(JSON.stringify(new Set()))).toStrictEqual([]);
                    expect(parse(JSON.stringify(123))).toStrictEqual([]);
                    expect(parse(undefined)).toStrictEqual([]);
                }),
            parsePruneStackIfExceedLength: (parse) =>
                it(`should take latest ${maxLength} items if stack length exceeded ${maxLength}`, () =>
                    expect(
                        parse(maxLength).every(
                            (item: any) =>
                                item.type === 'paginated' && item.page === 2
                        )
                    ).toBe(true)),
        });
        testAdminStackParser(generateTestCases());
        testUserStackParser(generateTestCases());
    });

export type { TestCases };
export default testStackParser;

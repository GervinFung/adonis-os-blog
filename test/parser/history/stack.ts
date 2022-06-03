import historyParser, { maxLength } from '../../../src/parser/history';

const testStackParser = () => {
    describe('Stack Parser', () => {
        const parser = historyParser();
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
            expect(parser.parseAsStack(JSON.stringify(stack))).toStrictEqual(
                stack.filter(({ type }, index) => index <= 4 && type)
            );
        });
        it('should failed to parse stack and return empty array as stack is not array', () => {
            expect(
                parser.parseAsStack(JSON.stringify(new Set()))
            ).toStrictEqual([]);
            expect(parser.parseAsStack(JSON.stringify(123))).toStrictEqual([]);
            expect(parser.parseAsStack(undefined)).toStrictEqual([]);
        });
        it(`should take latest ${maxLength} items if stack length exceeded ${maxLength}`, () => {
            const pruneItem = { type: 'paginated', page: 1 };
            const keepItem = { type: 'paginated', page: 2 };
            const pruneLength = 20;
            const stack = parser.parseAsStack(
                JSON.stringify(
                    Array.from(
                        { length: maxLength + pruneLength },
                        (_, index) =>
                            index < pruneLength ? pruneItem : keepItem
                    )
                )
            );
            expect(
                stack.every(
                    (item) => item.type === 'paginated' && item.page === 2
                )
            ).toBe(true);
        });
    });
};

export default testStackParser;

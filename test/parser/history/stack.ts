import { historyParser } from '../../../src/parser';
import { maxLength } from '../../../src/parser/history/stack';

const testStackParser = () => {
    describe('Stack Parser', () => {
        const parser = historyParser();
        it('should parse stack and not include invalid element', () => {
            const stack = [
                { type: 'posts', page: 1 },
                { type: 'posts', page: 2 },
                { type: undefined, posts: 3 },
                { type: 'post', id: '123' },
                { type: undefined, post: 'undefined' },
                // invalid item
                { type: 'post', posts: 'undefined' },
                { type: 'post', id: 1 },
                { type: 'posts', post: 'undefined' },
                { type: 'posts', page: '1' },
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
            const pruneItem = { type: 'posts', page: 1 };
            const keepItem = { type: 'posts', page: 2 };
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
                stack.every((item) => item.type === 'posts' && item.page === 2)
            ).toBe(true);
        });
    });
};

export default testStackParser;

import blogParser from '../../../../../src/parser/blog';

const testIdParser = () =>
    describe('Id Parser', () => {
        const {
            one: { parseAsId },
        } = blogParser();
        it('should parse valid id', () => {
            const idOne = '507f191e810c19729de860ea';
            expect(parseAsId(idOne)).toStrictEqual(idOne);
            const idTwo = 'hey';
            expect(parseAsId(idTwo)).toStrictEqual(idTwo);
        });
        it('should fail to parse invalid id and throw error', () => {
            expect(() => parseAsId(undefined)).toThrowError();
            expect(() => parseAsId(123)).toThrowError();
        });
    });

export default testIdParser;

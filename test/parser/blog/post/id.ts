import blogParser from '../../../../src/parser/blog';

const testIdParser = () => {
    describe('Id Parser', () => {
        const { one } = blogParser();
        it('should parse valid id', () => {
            const idOne = '507f191e810c19729de860ea';
            expect(one.parseAsId(idOne)).toStrictEqual(idOne);
            const idTwo = 'hey';
            expect(one.parseAsId(idTwo)).toStrictEqual(idTwo);
        });
        it('should fail to parse invalid id and throw error', () => {
            expect(() => one.parseAsId(undefined)).toThrowError();
            expect(() => one.parseAsId(123)).toThrowError();
        });
    });
};

export default testIdParser;

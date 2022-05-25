import { blogParser } from '../../../../src/parser';

const testIdParser = () => {
    describe('Id Parser', () => {
        const { post } = blogParser();
        it('should parse valid id', () => {
            const idOne = '507f191e810c19729de860ea';
            expect(post.parseAsId(idOne)).toStrictEqual(idOne);
            const idTwo = 'hey';
            expect(post.parseAsId(idTwo)).toStrictEqual(idTwo);
        });
        it('should fail to parse invalid id and throw error', () => {
            expect(() => post.parseAsId(undefined)).toThrowError();
            expect(() => post.parseAsId(123)).toThrowError();
        });
    });
};

export default testIdParser;

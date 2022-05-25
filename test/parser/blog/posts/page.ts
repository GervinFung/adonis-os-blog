import { blogParser } from '../../../../src/parser';

const testPageParser = () => {
    describe('Page Parser', () => {
        const { posts } = blogParser();
        it('should parse valid page', () => {
            const page = 100;
            expect(posts.parseAsPage(`${page}`)).toBe(page);
        });
        it('should fail to parse invalid total page and return min page', () => {
            const totalPosts = 'asd';
            expect(posts.parseAsPage(totalPosts)).toBe(1);
        });
    });
};

export default testPageParser;

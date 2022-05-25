import { blogParser } from '../../../../src/parser';

const testTotalPostParser = () => {
    describe('Total Post Parser', () => {
        const { posts } = blogParser();
        it('should parse valid total posts', () => {
            const totalPosts = 100;
            expect(posts.parseAsTotalPosts(totalPosts)).toBe(totalPosts);
        });
        it('should fail to parse invalid total posts and return min total posts', () => {
            const totalPosts = '100';
            expect(posts.parseAsTotalPosts(totalPosts)).toBe(0);
        });
    });
};

export default testTotalPostParser;

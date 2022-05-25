import testPageParser from './page';
import testPostsParser from './posts';
import testTotalPostParser from './total';

const testBlogPostsParser = () => {
    describe('Blog', () => {
        testPageParser();
        testPostsParser();
        testTotalPostParser();
    });
};

export default testBlogPostsParser;

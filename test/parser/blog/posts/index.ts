import testPageParser from './page';
import testPostsParser from './query';
import testTotalPostParser from './total';

const testBlogPostsParser = () =>
    describe('Posts Parser', () => {
        testPageParser();
        testTotalPostParser();
        testPostsParser();
    });

export default testBlogPostsParser;

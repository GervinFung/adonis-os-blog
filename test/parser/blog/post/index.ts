import testIdParser from './id';
import testPostParser from './post';

const testBlogPostParser = () => {
    describe('Blog', () => {
        testPostParser();
        testIdParser();
    });
};

export default testBlogPostParser;

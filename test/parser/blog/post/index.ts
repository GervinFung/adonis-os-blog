import testIdParser from './id';
import testPostParser from './post';
import testQueryInsertPostFromJSonParser from './post-operation/insert';

const testBlogPostParser = () => {
    describe('Blog', () => {
        testPostParser();
        testIdParser();
    });
    describe('Post-Operation', () => {
        testQueryInsertPostFromJSonParser();
    });
};

export default testBlogPostParser;

import testTokenParser from './auth';
import testQueryOptionParser from './query-option';

const testAdminPropsParser = () =>
    describe('Admin Props', () => {
        testTokenParser();
        testQueryOptionParser();
    });

export default testAdminPropsParser;

import testIndexNavigationParser from './index-navigation';
import testStackParser from './stack';

const testHistoryParser = () =>
    describe('History', () => {
        testStackParser();
        testIndexNavigationParser();
    });

export default testHistoryParser;

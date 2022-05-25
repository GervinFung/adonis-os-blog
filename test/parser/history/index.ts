import testIndexNavigationParser from './indexNavigation';
import testStackParser from './stack';

const testHistoryParser = () => {
    describe('History', () => {
        testStackParser();
        testIndexNavigationParser();
    });
};

export default testHistoryParser;

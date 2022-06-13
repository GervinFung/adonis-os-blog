import testIdParser from './id';
import testMutatePostParser from './mutation';
import testQueryPostParser from './query';
import testUpdateStatusParser from './status';

const dummyDataCommonProps = {
    title: 'Title',
    description: 'Description',
    content: 'Content',
} as const;

type DummyData = typeof dummyDataCommonProps;

const testBlogPostParser = () =>
    describe('Blog', () => {
        testQueryPostParser(dummyDataCommonProps);
        testMutatePostParser(dummyDataCommonProps);
        testIdParser();
        testUpdateStatusParser();
    });

export type { DummyData };
export default testBlogPostParser;

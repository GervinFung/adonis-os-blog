import { DummyData } from '..';
import testInsert from './insert';
import testUpdate from './update';

const testMutatePostParser = (dummyDataCommonProps: DummyData) =>
    describe('Mutate Post Parser', () => {
        testInsert(dummyDataCommonProps);
        testUpdate(dummyDataCommonProps);
    });

export type { DummyData };
export default testMutatePostParser;

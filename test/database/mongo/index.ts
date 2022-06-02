import promiseifyMongoDb from '../../../src/database/mongo';
import testMutation from './mutation';
import testQuery from './query';

const testMongo = () =>
    describe('MongoDB', () => {
        testQuery();
        testMutation();
        afterAll(async () => {
            (await promiseifyMongoDb).close();
        });
    });

export default testMongo;

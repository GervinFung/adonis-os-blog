import promiseifyMongoDb from '../../../src/database/mongo';
import testPost from './post';
import testAuthRecord from './auth-record';

const testMongo = () =>
    describe('MongoDB', () => {
        testAuthRecord();
        testPost();
        afterAll(async () => {
            (await promiseifyMongoDb).close();
        });
    });

export default testMongo;

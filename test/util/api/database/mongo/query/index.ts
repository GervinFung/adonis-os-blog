import { ObjectId } from 'mongodb';
import mongodb from '../../../../../../src/util/api/database/mongo';
import testPostQuery from './post';
import testPostsQuery from './posts';

type DummyData = ReadonlyArray<
    Readonly<{
        _id: ObjectId;
        content: string;
        description: string;
        title: string;
        timeCreated: Date;
        timeUpdated: Date;
        timePublished: Date;
    }>
>;

const testQuery = () => {
    describe('Query', () => {
        const dummyData: DummyData = Array.from({ length: 27 }, (_, index) => ({
            _id: new ObjectId(),
            content: `Content ${index}`,
            description: `Description ${index}`,
            title: `Title ${index}`,
            timeCreated: new Date('2022-05-12T14:53:49.165Z'),
            timeUpdated: new Date('2022-05-12T14:53:49.165Z'),
            timePublished: new Date('2022-05-12T14:53:49.165Z'),
        }));
        beforeAll(async () => {
            const mongo = await mongodb;
            await mongo.clearCollections();
            await mongo.bulkInsert(dummyData);
        });
        testPostsQuery(dummyData);
        testPostQuery(dummyData);
    });
};

export type { DummyData };

export default testQuery;

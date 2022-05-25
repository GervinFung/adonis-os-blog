import mongodb from '../../../../../../../src/util/api/database/mongo';

const testInsertPost = () =>
    describe('Post', () => {
        beforeEach(async () => {
            const mongo = await mongodb;
            mongo.clearCollections();
        });
        it('should insert new post', async () => {
            const mongo = await mongodb;
            const document = await mongo.insertPost({
                content: 'Hello Eillie',
                description: 'Hello to a friend of mine',
                title: 'A friend',
                timeCreated: new Date(),
            });
            expect(document.acknowledged).toBe(true);
            expect(document.insertedId).toBeTruthy();
        });
    });

export default testInsertPost;

import promisifyMongoDb from '../../../../src/database/mongo';

const testMutatePost = () =>
    describe('Post', () => {
        beforeEach(async () => {
            const { postCollection } = await promisifyMongoDb;
            await postCollection.clear();
        });
        it('should insert, update and soft delete post', async () => {
            const { postCollection } = await promisifyMongoDb;
            const dummyDataOne = {
                content: 'Hello Eillie',
                description: 'Hello to a friend of mine',
                title: 'A friend',
                timeCreated: new Date(),
            };
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);
            expect(insertedIdOne).toBeTruthy();

            const insertedIdTwo = await postCollection.insertOne({
                content: 'Hello Ellie',
                description: 'Hello to a friend',
                title: 'A friend',
                timeCreated: new Date(),
            });
            expect(insertedIdTwo).toBeTruthy();

            const updatedIdOne = await postCollection.updateOne(insertedIdOne, {
                ...dummyDataOne,
                timeUpdated: new Date(),
                timePublished: new Date(),
            });
            expect(updatedIdOne.toHexString()).toBe(
                insertedIdOne.toHexString()
            );

            const deletedIdOne = await postCollection.deleteOne(insertedIdOne);
            expect(deletedIdOne.toHexString()).toBe(
                insertedIdOne.toHexString()
            );
        });
    });

export default testMutatePost;

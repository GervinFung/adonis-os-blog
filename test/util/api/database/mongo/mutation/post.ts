import mongodb from '../../../../../../src/util/api/database/mongo';

const testMutatePost = () =>
    describe('Post', () => {
        beforeEach(async () => {
            const mongo = await mongodb;
            await mongo.clearCollections();
        });
        it('should insert, update and soft delete post', async () => {
            const mongo = await mongodb;
            const dummyDataOne = {
                content: 'Hello Eillie',
                description: 'Hello to a friend of mine',
                title: 'A friend',
                timeCreated: new Date(),
            };
            const insertedIdOne = await mongo.insertPost(dummyDataOne);
            expect(insertedIdOne).toBeTruthy();

            const insertedIdTwo = await mongo.insertPost({
                content: 'Hello Ellie',
                description: 'Hello to a friend',
                title: 'A friend',
                timeCreated: new Date(),
            });
            expect(insertedIdTwo).toBeTruthy();

            const updatedIdOne = await mongo.updatePost(insertedIdOne, {
                ...dummyDataOne,
                timeUpdated: new Date(),
                timePublished: new Date(),
            });
            expect(updatedIdOne.toHexString()).toBe(
                insertedIdOne.toHexString()
            );

            const deletedIdOne = await mongo.deletePost(insertedIdOne);
            expect(deletedIdOne.toHexString()).toBe(
                insertedIdOne.toHexString()
            );
        });
    });

export default testMutatePost;

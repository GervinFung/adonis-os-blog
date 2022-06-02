import promisifyMongoDb from '../../../../src/database/mongo';

const testPublishPost = () =>
    describe('Publish', () => {
        beforeEach(async () => {
            const { postCollection } = await promisifyMongoDb;
            await postCollection.clear();
        });
        it('should publish exisiting unpublished post', async () => {
            const { postCollection } = await promisifyMongoDb;
            const dummyData = {
                content: 'Hello Eillie',
                description: 'Hello to a friend of mine',
                title: 'A friend',
                timeCreated: new Date(),
            };
            const insertedId = await postCollection.insertOne(dummyData);
            expect(postCollection.showOne(insertedId)).rejects.toThrowError();

            const publishedId = await postCollection.publishOne(insertedId);
            const postToBeUpdated = await postCollection.showPostToBeUpdated(
                publishedId
            );

            expect(postToBeUpdated.timePublished).toBeTruthy();
            expect(postToBeUpdated.id.toHexString()).toBe(
                publishedId.toHexString()
            );
            expect(postToBeUpdated.content).toBe(dummyData.content);
            expect(postToBeUpdated.description).toBe(dummyData.description);
            expect(postToBeUpdated.title).toBe(dummyData.title);
        });
    });

export default testPublishPost;

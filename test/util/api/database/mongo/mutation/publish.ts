import mongodb from '../../../../../../src/util/api/database/mongo';

const testPublishPost = () =>
    describe('Publish', () => {
        beforeEach(async () => {
            const mongo = await mongodb;
            await mongo.clearCollections();
        });
        it('should publish exisiting unpublished post', async () => {
            const mongo = await mongodb;
            const dummyData = {
                content: 'Hello Eillie',
                description: 'Hello to a friend of mine',
                title: 'A friend',
                timeCreated: new Date(),
            };
            const insertedId = await mongo.insertPost(dummyData);
            expect(mongo.showPost(insertedId)).rejects.toThrowError();

            const publishedId = await mongo.publishPost(insertedId);
            const post = await mongo.showPostToBeUpdated(publishedId);

            expect(post.timePublished).toBeTruthy();
            expect(post.id.toHexString()).toBe(publishedId.toHexString());
            expect(post.content).toBe(dummyData.content);
            expect(post.description).toBe(dummyData.description);
            expect(post.title).toBe(dummyData.title);
        });
    });

export default testPublishPost;

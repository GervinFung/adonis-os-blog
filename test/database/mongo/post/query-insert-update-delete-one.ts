import { ObjectId } from 'mongodb';
import promisifyMongoDb from '../../../../src/database/mongo';

const testQueryInsertUpdateDeleteOne = () =>
    describe('Query, Insert, Update and Delete', () => {
        beforeEach(async () => {
            const { postCollection } = await promisifyMongoDb;
            await postCollection.clear();
        });
        it('should throw error for querying post with non-existent id', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(
                postCollection.showOne(new ObjectId())
            ).rejects.toThrowError();
        });
        it('should query, insert, update and soft delete post', async () => {
            const { postCollection } = await promisifyMongoDb;
            const dummyDataOne = {
                content: 'Hello Eillie',
                description: 'Hello to a friend of mine',
                title: 'A friend',
                timeCreated: new Date(),
            };

            // insert
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);
            expect(insertedIdOne).toBeTruthy();

            const insertedIdTwo = await postCollection.insertOne({
                content: 'Hello Ellie',
                description: 'Hello to a friend',
                title: 'A friend',
                timeCreated: new Date(),
            });
            expect(insertedIdTwo).toBeTruthy();

            // should throw error for post with id and undefined published time
            expect(
                postCollection.showOne(insertedIdOne)
            ).rejects.toThrowError();
            expect(
                postCollection.showOne(insertedIdTwo)
            ).rejects.toThrowError();

            // update
            expect(
                (
                    await postCollection.updateOne(insertedIdOne, {
                        ...dummyDataOne,
                        timeUpdated: new Date(),
                        timePublished: new Date(),
                    })
                ).toHexString()
            ).toBe(insertedIdOne.toHexString());

            // delete
            expect(
                (await postCollection.deleteOne(insertedIdOne)).toHexString()
            ).toBe(insertedIdOne.toHexString());

            // publish
            expect(
                (await postCollection.publishOne(insertedIdOne)).toHexString()
            ).toBe(insertedIdOne.toHexString());

            const postToBeUpdated = await postCollection.showPostToBeUpdated(
                insertedIdOne
            );

            expect(postToBeUpdated.timePublished).toBeTruthy();
            expect(postToBeUpdated.id.toHexString()).toBe(
                insertedIdOne.toHexString()
            );
            expect(postToBeUpdated.content).toBe(dummyDataOne.content);
            expect(postToBeUpdated.description).toBe(dummyDataOne.description);
            expect(postToBeUpdated.title).toBe(dummyDataOne.title);

            // query
            const queryOne = await postCollection.showOne(insertedIdOne);
            expect(queryOne.title).toStrictEqual(dummyDataOne.title);
            expect(queryOne.description).toStrictEqual(
                dummyDataOne.description
            );
            expect(queryOne.content).toStrictEqual(dummyDataOne.content);
            expect(queryOne.timePublished).toBeTruthy();
        });
    });

export default testQueryInsertUpdateDeleteOne;

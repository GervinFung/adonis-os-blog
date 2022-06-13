import promisifyMongoDb from '../../../../src/database/mongo';

const testQueryInsertUpdateOne = () =>
    describe('Query, Insert and Update', () => {
        const dummyDataOne = {
            content: 'Hello Eillie',
            description: 'Hello to a friend of mine',
            title: 'A friend',
            timeCreated: new Date(),
        };
        beforeEach(async () => {
            const { postCollection } = await promisifyMongoDb;
            await postCollection.clear();
        });
        it('should insert, update and query a post', async () => {
            const { postCollection } = await promisifyMongoDb;
            // insert
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);
            expect(insertedIdOne).toBeTruthy();

            const newData = {
                timePublished: new Date(),
                title: 'New title',
                content: 'New content',
                description: 'New description',
            };

            // update
            expect(
                (
                    await postCollection.updateOne({
                        ...newData,
                        id: insertedIdOne,
                        timeUpdated: new Date(),
                    })
                ).toHexString()
            ).toBe(insertedIdOne.toHexString());

            expect(
                await postCollection.showPublishedOne(insertedIdOne)
            ).toStrictEqual(newData);
        });
    });

export default testQueryInsertUpdateOne;

import { ObjectId } from 'mongodb';
import promisifyMongoDb from '../../../../src/database/mongo';

const testQueryPaginated = () =>
    describe('Posts Query', () => {
        beforeAll(async () => {
            const { postCollection } = await promisifyMongoDb;
            await postCollection.clear();
            await postCollection.bulkInsert(dummyData);
        });
        const dummyData = Array.from({ length: 27 }, (_, index) => {
            const data = {
                _id: new ObjectId(),
                content: `Content ${index}`,
                description: `Description ${index}`,
                title: `Title ${index}`,
                timeCreated: new Date('2022-05-12T14:53:00.165Z'),
                timeUpdated: new Date('2022-05-12T14:53:00.165Z'),
                timePublished: new Date(
                    `2022-05-12T14:53:${index >= 10 ? index : `0${index}`}.165Z`
                ),
            };
            return index < 18
                ? data
                : {
                      ...data,
                      timePublished: undefined,
                  };
        });
        it('should query paginated posts', async () => {
            const paginateDummyData = ({
                start,
                end,
            }: Readonly<{ start: number; end: number }>) =>
                dummyData
                    .filter((_, index) => index >= start && index <= end)
                    .flatMap(({ _id, title, description, timePublished }) =>
                        !timePublished
                            ? []
                            : [
                                  {
                                      id: _id.toHexString(),
                                      title,
                                      description,
                                      timePublished,
                                  },
                              ]
                    )
                    .sort(
                        (a, b) =>
                            b.timePublished.getTime() -
                            a.timePublished.getTime()
                    );
            const { postCollection } = await promisifyMongoDb;
            expect(
                await postCollection.showManyPublishedOnly({ skip: 0 })
            ).toStrictEqual(paginateDummyData({ start: 9, end: 17 }));
            expect(
                await postCollection.showManyPublishedOnly({ skip: 1 })
            ).toStrictEqual(paginateDummyData({ start: 0, end: 8 }));
            expect(
                (await postCollection.showManyPublishedOnly({ skip: 2 })).length
            ).toBe(0);
            expect(
                (await postCollection.showManyPublishedOnly({ skip: 3 })).length
            ).toBe(0);
        });
        it('should return total number of posts', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(await postCollection.totalPosts()).toBe(
                dummyData.filter((data) => data.timePublished).length
            );
        });
    });

export default testQueryPaginated;

import { ObjectId } from 'mongodb';
import promisifyMongoDb from '../../../../src/database/mongo';

const testQueryPaginated = () =>
    describe('Paginated Query', () => {
        beforeAll(async () => {
            const { postCollection } = await promisifyMongoDb;
            await postCollection.clear();
            await postCollection.bulkInsert(dummyData);
        });
        const dummyData = Array.from({ length: 36 }, (_, index) => {
            const timeStamp = `2022-05-12T14:53:${
                index >= 10 ? index : `0${index}`
            }.165Z`;
            const data = {
                _id: new ObjectId(),
                content: `Content ${index}`,
                description: `Description ${index}`,
                title: `Title ${index}`,
                timeCreated: new Date(timeStamp),
                timeUpdated: new Date('2022-05-12T14:53:00.165Z'),
                timePublished: new Date(timeStamp),
                timeDeleted: undefined,
            };
            if (index < 18) {
                return data;
            }
            if (index < 27) {
                return {
                    ...data,
                    timePublished: undefined,
                };
            }
            return {
                ...data,
                timePublished: undefined,
                timeDeleted: new Date(timeStamp),
            };
        });
        it('should query paginated posts', async () => {
            const paginatePublishedDummyData = ({
                start,
                end,
            }: Readonly<{
                start: number;
                end: number;
            }>) =>
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

            // published posts
            expect(
                (await postCollection.showManyPublished({ skip: 2 })).length
            ).toBe(0);
            expect(
                await postCollection.showManyPublished({ skip: 0 })
            ).toStrictEqual(
                paginatePublishedDummyData({
                    start: 9,
                    end: 17,
                })
            );
            expect(
                await postCollection.showManyPublished({ skip: 1 })
            ).toStrictEqual(
                paginatePublishedDummyData({
                    start: 0,
                    end: 8,
                })
            );

            // unpublished posts
            expect(
                (await postCollection.showManyUnpublished({ skip: 1 })).length
            ).toBe(0);
            expect(
                await postCollection.showManyUnpublished({
                    skip: 0,
                })
            ).toStrictEqual(
                dummyData
                    .filter((_, index) => index >= 18 && index <= 26)
                    .map(({ _id, title, description, timeCreated }) => ({
                        id: _id.toHexString(),
                        title,
                        description,
                        timeCreated,
                    }))
                    .sort(
                        (a, b) =>
                            b.timeCreated.getTime() - a.timeCreated.getTime()
                    )
            );

            // deleted posts
            expect(
                (await postCollection.showManyDeleted({ skip: 1 })).length
            ).toBe(0);

            expect(
                await postCollection.showManyDeleted({
                    skip: 0,
                })
            ).toStrictEqual(
                dummyData
                    .flatMap(({ _id, title, description, timeDeleted }) =>
                        !timeDeleted
                            ? []
                            : [
                                  {
                                      id: _id.toHexString(),
                                      title,
                                      description,
                                      timeDeleted,
                                  },
                              ]
                    )
                    .sort(
                        (a, b) =>
                            b.timeDeleted.getTime() - a.timeDeleted.getTime()
                    )
            );
        });
        it('should return total number of deleted posts', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(await postCollection.totalDeletedPosts()).toBe(
                dummyData.filter((data) => data.timeDeleted).length
            );
        });
        it('should return total number of unpublished posts', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(await postCollection.totalUnpublishedPosts()).toBe(
                dummyData.filter(
                    (data) => !data.timePublished && !data.timeDeleted
                ).length
            );
        });
        it('should return total number of published posts', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(await postCollection.totalPublishedPosts()).toBe(
                dummyData.filter((data) => data.timePublished).length
            );
        });
        it('should return true for published + unpublished + deleted post equal to total posts', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(
                (await postCollection.totalPublishedPosts()) +
                    (await postCollection.totalUnpublishedPosts()) +
                    (await postCollection.totalDeletedPosts())
            ).toBe(dummyData.length);
        });
    });

export default testQueryPaginated;

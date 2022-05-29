import { DummyData } from '.';
import mongodb from '../../../../../../src/util/api/database/mongo';

const testPostsQuery = (dummyData: DummyData) =>
    describe('Posts', () => {
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
            const mongo = await mongodb;
            expect(await mongo.showPosts({ skip: 0 })).toStrictEqual(
                paginateDummyData({ start: 9, end: 17 })
            );
            expect(await mongo.showPosts({ skip: 1 })).toStrictEqual(
                paginateDummyData({ start: 0, end: 8 })
            );
            expect((await mongo.showPosts({ skip: 2 })).length).toBe(0);
            expect((await mongo.showPosts({ skip: 3 })).length).toBe(0);
        });
        it('should return total number of posts', async () => {
            const mongo = await mongodb;
            expect(await mongo.totalPosts()).toBe(
                dummyData.filter((data) => data.timePublished).length
            );
        });
    });

export default testPostsQuery;

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
                    .map(({ _id, title, description, timePublished }) => ({
                        id: _id.toHexString(),
                        title,
                        description,
                        timePublished,
                    }));

            const mongo = await mongodb;
            expect(await mongo.showPosts({ skip: 0 })).toStrictEqual(
                paginateDummyData({ start: 0, end: 8 })
            );
            expect(await mongo.showPosts({ skip: 1 })).toStrictEqual(
                paginateDummyData({ start: 9, end: 17 })
            );
            expect(await mongo.showPosts({ skip: 2 })).toStrictEqual(
                paginateDummyData({ start: 18, end: 26 })
            );
        });
        it('should return total number of posts', async () => {
            const mongo = await mongodb;
            expect(await mongo.totalPosts()).toBe(dummyData.length);
        });
    });

export default testPostsQuery;

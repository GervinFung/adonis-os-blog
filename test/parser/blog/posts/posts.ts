import { blogParser } from '../../../../src/parser';

const testPostsParser = () => {
    describe('Posts Parser', () => {
        const { posts } = blogParser();
        it('should parse valid posts', () => {
            const dummyData = [
                {
                    id: '628a48e232347c40baef8bad',
                    description: 'Description 0',
                    title: 'Title 0',
                    timePublished: '2022-05-22T14:28:50.047Z',
                },
                {
                    id: '628a48e232347c40baef8bae',
                    description: 'Description 1',
                    title: 'Title 1',
                    timePublished: '2022-05-22T14:28:50.047Z',
                },
            ];
            expect(posts.parseAsPosts(dummyData)).toStrictEqual(
                dummyData.map((data) => ({
                    ...data,
                    timePublished: new Date(data.timePublished),
                }))
            );
        });
        it('should fail to parse invalid posts and return empty posts', () => {
            expect(posts.parseAsPosts('123')).toStrictEqual([]);
            expect(posts.parseAsPosts({ wifi: '123' })).toStrictEqual([]);
        });
        it('should fail to parse invalid properties of posts and throw error', () => {
            const dummyData = [
                {
                    id: '628a48e232347c40baef8bad',
                    description: 'Description 0',
                    title: 'Title 0',
                    timePublished: '2022-05-22T14:28:50.047Z',
                },
            ];
            expect(() =>
                posts.parseAsPosts(dummyData.map(({ id, ...props }) => props))
            ).toThrowError();
            expect(() =>
                posts.parseAsPosts(
                    dummyData.map(({ description, ...props }) => props)
                )
            ).toThrowError();
            expect(() =>
                posts.parseAsPosts(
                    dummyData.map(({ title, ...props }) => props)
                )
            ).toThrowError();
            expect(() =>
                posts.parseAsPosts(
                    dummyData.map(({ timePublished, ...props }) => props)
                )
            ).toThrowError();
        });
    });
};

export default testPostsParser;

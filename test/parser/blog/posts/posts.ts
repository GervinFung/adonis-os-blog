import blogParser from '../../../../src/parser/blog';

const testPostsParser = () => {
    describe('Posts Parser', () => {
        const { paginated } = blogParser();
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
            expect(paginated.parseAsPosts(dummyData)).toStrictEqual(
                dummyData.map((data) => ({
                    ...data,
                    timePublished: new Date(data.timePublished),
                }))
            );
        });
        it('should fail to parse invalid posts and return empty posts', () => {
            expect(paginated.parseAsPosts('123')).toStrictEqual([]);
            expect(paginated.parseAsPosts({ wifi: '123' })).toStrictEqual([]);
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
                paginated.parseAsPosts(
                    dummyData.map(({ id: _, ...props }) => props)
                )
            ).toThrowError();
            expect(() =>
                paginated.parseAsPosts(
                    dummyData.map(({ description: _, ...props }) => props)
                )
            ).toThrowError();
            expect(() =>
                paginated.parseAsPosts(
                    dummyData.map(({ title: _, ...props }) => props)
                )
            ).toThrowError();
            expect(() =>
                paginated.parseAsPosts(
                    dummyData.map(({ timePublished: _, ...props }) => props)
                )
            ).toThrowError();
        });
    });
};

export default testPostsParser;

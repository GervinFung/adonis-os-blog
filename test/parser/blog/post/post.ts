import blogParser from '../../../../src/parser/blog';

const testPostParser = () => {
    describe('Post Parser', () => {
        const { one } = blogParser();
        const dummyData = {
            title: 'Title',
            description: 'Description',
            content: 'Content',
            timePublished: '2022-05-24T04:04:02.734Z',
        };
        it('should parse valid post', () => {
            expect(one.parseAsPost(dummyData)).toStrictEqual({
                ...dummyData,
                timePublished: new Date(dummyData.timePublished),
            });
        });
        it('should fail to parse invalid post and throw error', () => {
            expect(() =>
                one.parseAsPost({ ...dummyData, title: undefined })
            ).toThrowError();
            expect(() =>
                one.parseAsPost({ ...dummyData, description: undefined })
            ).toThrowError();
            expect(() =>
                one.parseAsPost({ ...dummyData, content: undefined })
            ).toThrowError();
            expect(() =>
                one.parseAsPost({ ...dummyData, timePublished: undefined })
            ).toThrowError();
        });
    });
};

export default testPostParser;

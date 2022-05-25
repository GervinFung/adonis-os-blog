import { blogParser } from '../../../../src/parser';

const testPostParser = () => {
    describe('Post Parser', () => {
        const { post } = blogParser();
        const dummyData = {
            title: 'Title',
            description: 'Description',
            content: 'Content',
            timePublished: '2022-05-24T04:04:02.734Z',
        };
        it('should parse valid post', () => {
            expect(post.parseAsPost(dummyData)).toStrictEqual({
                ...dummyData,
                timePublished: new Date(dummyData.timePublished),
            });
        });
        it('should fail to parse invalid post and throw error', () => {
            expect(() =>
                post.parseAsPost({ ...dummyData, title: undefined })
            ).toThrowError();
            expect(() =>
                post.parseAsPost({ ...dummyData, description: undefined })
            ).toThrowError();
            expect(() =>
                post.parseAsPost({ ...dummyData, content: undefined })
            ).toThrowError();
            expect(() =>
                post.parseAsPost({ ...dummyData, timePublished: undefined })
            ).toThrowError();
        });
    });
};

export default testPostParser;

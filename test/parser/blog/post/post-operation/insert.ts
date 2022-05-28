import parseAsInsertPost from '../../../../../post-operation/parser/post/insert';

const testQueryInsertPostFromJSonParser = () => {
    describe('Insert Parser', () => {
        const dummyData = {
            title: 'Title',
            description: 'Description',
            content: 'Content',
        };
        it('should parse valid post', () => {
            expect(parseAsInsertPost(dummyData)).toStrictEqual(dummyData);
        });
        it('should fail to parse invalid post and throw error', () => {
            expect(() =>
                parseAsInsertPost({ ...dummyData, title: undefined })
            ).toThrowError();
            expect(() =>
                parseAsInsertPost({ ...dummyData, description: undefined })
            ).toThrowError();
            expect(() =>
                parseAsInsertPost({ ...dummyData, content: undefined })
            ).toThrowError();
        });
    });
};

export default testQueryInsertPostFromJSonParser;

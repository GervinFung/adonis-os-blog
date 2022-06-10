import { DummyData } from '.';
import blogPropsParser from '../../../../../src/parser/blog';

const testInsert = (dummyData: DummyData) => {
    describe('Insert', () => {
        const {
            one: { parseAsInsertPost },
        } = blogPropsParser();
        it('should parse data as valid insert post', () => {
            expect(parseAsInsertPost(dummyData)).toStrictEqual(dummyData);
        });
        it('should fail to parse and throw error', () => {
            expect(() =>
                parseAsInsertPost({
                    ...dummyData,
                    title: undefined,
                })
            ).toThrowError();
            expect(() =>
                parseAsInsertPost({
                    ...dummyData,
                    description: undefined,
                })
            ).toThrowError();
            expect(() =>
                parseAsInsertPost({
                    ...dummyData,
                    content: undefined,
                })
            ).toThrowError();
        });
    });
};

export default testInsert;

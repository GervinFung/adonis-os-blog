import { DummyData } from '.';
import blogPropsParser from '../../../../../src/parser/blog';

const testUpdate = (dummyDataCommonProps: DummyData) => {
    describe('Update', () => {
        const {
            one: { parseAsUpdatePost },
        } = blogPropsParser();
        const dummyData = {
            ...dummyDataCommonProps,
            id: '1',
            timePublished: new Date().toISOString(),
        };
        it('should parse data as valid update post', () => {
            expect(parseAsUpdatePost(dummyData)).toStrictEqual({
                ...dummyData,
                timePublished: new Date(dummyData.timePublished),
            });
        });
        it('should fail to parse and throw error', () => {
            expect(() =>
                parseAsUpdatePost({
                    ...dummyData,
                    title: undefined,
                })
            ).toThrowError();
            expect(() =>
                parseAsUpdatePost({
                    ...dummyData,
                    description: undefined,
                })
            ).toThrowError();
            expect(() =>
                parseAsUpdatePost({
                    ...dummyData,
                    content: undefined,
                })
            ).toThrowError();
            expect(() =>
                parseAsUpdatePost({
                    ...dummyData,
                    id: undefined,
                })
            ).toThrowError();
            expect(() =>
                parseAsUpdatePost({
                    ...dummyData,
                    timePublished: undefined,
                })
            ).toThrowError();
        });
    });
};

export default testUpdate;

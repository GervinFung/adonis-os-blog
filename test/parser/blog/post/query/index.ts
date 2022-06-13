import { DummyData } from '..';
import testDeleted from './deleted';
import testPublished from './published';
import testUnpublished from './unpublished';

type TestCasesCallBack<Post> = (post: unknown) => Post;

type TestCases<Post> = Readonly<{
    parseAsValidPost: (parse: TestCasesCallBack<Post>) => void;
    parseInvalidPostThrowError: (parse: TestCasesCallBack<Post>) => void;
    parseAsUndefined: (parse: TestCasesCallBack<Post>) => void;
}>;

type DateTime = 'timeCreated' | 'timeDeleted' | 'timePublished';

const testQueryPostParser = (dummyDataCommonProps: DummyData) =>
    describe('Query Post Parser', () => {
        const dateTime = '2022-05-24T04:04:02.734Z';

        const generateTestCases = <Post>(time: DateTime): TestCases<Post> => {
            const dummyData = { ...dummyDataCommonProps, [time]: dateTime };
            return {
                parseAsUndefined: (parse) =>
                    it('should parse undefined post', () =>
                        expect(parse(undefined)).toBeUndefined()),
                parseAsValidPost: (parse) =>
                    it('should parse valid post', () =>
                        expect(parse(dummyData)).toStrictEqual({
                            ...dummyData,
                            [time]: new Date(dateTime),
                        })),
                parseInvalidPostThrowError: (parse) =>
                    it('should fail to parse invalid post and throw error', () => {
                        expect(() =>
                            parse({
                                ...dummyData,
                                title: undefined,
                            })
                        ).toThrowError();
                        expect(() =>
                            parse({
                                ...dummyData,
                                description: undefined,
                            })
                        ).toThrowError();
                        expect(() =>
                            parse({
                                ...dummyData,
                                content: undefined,
                            })
                        ).toThrowError();
                        expect(() =>
                            parse({
                                ...dummyData,
                                [time]: undefined,
                            })
                        ).toThrowError();
                    }),
            };
        };

        testPublished(generateTestCases('timePublished'));
        testDeleted(generateTestCases('timeDeleted'));
        testUnpublished(generateTestCases('timeCreated'));
    });

export type { TestCases, DateTime };
export default testQueryPostParser;

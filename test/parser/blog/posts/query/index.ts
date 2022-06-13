import { DateTime } from '../../post/query';
import testDeleted from './deleted';
import testPublished from './published';
import testUnpublished from './unpublished';

type TestCasesCallBack<Posts> = (post: unknown) => Posts;

type TestCases<Posts> = Readonly<{
    parseAsValidPosts: (parse: TestCasesCallBack<Posts>) => void;
    parseInvalidPostsThrowError: (parse: TestCasesCallBack<Posts>) => void;
    parseAsEmptyPosts: (parse: TestCasesCallBack<Posts>) => void;
}>;

const testPostsParser = () => {
    describe('Posts Parser', () => {
        const dateTime = '2022-05-24T04:04:02.734Z';

        const dummyDatasCommonProps = [
            {
                id: '628a48e232347c40baef8bad',
                description: 'Description 0',
                title: 'Title 0',
            },
        ] as const;

        const generateTestCases = <Posts>(time: DateTime): TestCases<Posts> => {
            const dummyDatas = dummyDatasCommonProps.map((data) => ({
                ...data,
                [time]: new Date(dateTime),
            }));
            return {
                parseAsEmptyPosts: (parse) =>
                    it('should fail to parse invalid posts and return empty posts', () => {
                        expect(parse('123')).toStrictEqual([]);
                        expect(parse({ wifi: '123' })).toStrictEqual([]);
                    }),
                parseAsValidPosts: (parse) =>
                    it('should parse valid posts', () => {
                        expect(
                            parse(
                                dummyDatasCommonProps.map((data) => ({
                                    ...data,
                                    [time]: dateTime,
                                }))
                            )
                        ).toStrictEqual(dummyDatas);
                    }),
                parseInvalidPostsThrowError: (parse) =>
                    it('should fail to parse invalid properties of posts and throw error', () => {
                        expect(() =>
                            parse(
                                dummyDatas.map(({ id: _, ...props }) => props)
                            )
                        ).toThrowError();
                        expect(() =>
                            parse(
                                dummyDatas.map(
                                    ({ description: _, ...props }) => props
                                )
                            )
                        ).toThrowError();
                        expect(() =>
                            parse(
                                dummyDatas.map(
                                    ({ title: _, ...props }) => props
                                )
                            )
                        ).toThrowError();
                        expect(() =>
                            parse(dummyDatasCommonProps)
                        ).toThrowError();
                    }),
            };
        };

        testDeleted(generateTestCases('timeDeleted'));
        testUnpublished(generateTestCases('timeCreated'));
        testPublished(generateTestCases('timePublished'));
    });
};

export type { TestCases };
export default testPostsParser;

import adminPropsParser from '../../../../src/parser/admin';
import { admin } from '../../../../src/util/const';

const testQueryOptionParser = () =>
    describe('Query Option Parser', () => {
        const { posts } = adminPropsParser();
        it('should parse valid option', () => {
            admin.postQueryOptions.every((option) =>
                expect(posts.parseAsPostQueryOption(option)).toBe(option)
            );
        });
        it('should fail to pass invalid option and throw error', () => {
            expect(() => posts.parseAsPostQueryOption('option')).toThrowError();
        });
    });

export default testQueryOptionParser;

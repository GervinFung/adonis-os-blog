import blogParser from '../../../../../src/parser/blog';
import { admin } from '../../../../../src/util/const';

const testUpdateStatusParser = () =>
    describe('Update Status Parser', () => {
        const {
            one: { parseAsUpdatePostStatus },
        } = blogParser();
        it('should parse valid status', () => {
            admin.updatePostStatus.every((status) =>
                expect(parseAsUpdatePostStatus(status)).toBe(status)
            );
        });
        it('should fail to parse invalid status and throw error', () => {
            expect(() => parseAsUpdatePostStatus(undefined)).toThrowError();
            expect(() => parseAsUpdatePostStatus(123)).toThrowError();
        });
    });

export default testUpdateStatusParser;

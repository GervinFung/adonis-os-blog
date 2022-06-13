import adminPropsParser from '../../../../src/parser/admin';

const testTokenParser = () =>
    describe('Token Parser', () => {
        const { auth } = adminPropsParser();
        it('should parse string as token', () => {
            const token = '123';
            expect(auth.parseAsToken(token)).toBe(token);
            expect(auth.parseAsNullableToken(token)).toBe(token);
        });
        it('should parse non-string value as undefinnd', () => {
            expect(() => auth.parseAsToken(23)).toThrowError();
            expect(() => auth.parseAsToken(true)).toThrowError();
        });
        it('should fail to parse non-string value and throw error', () => {
            expect(auth.parseAsNullableToken(23)).toBeUndefined();
            expect(auth.parseAsNullableToken(true)).toBeUndefined();
        });
    });

export default testTokenParser;

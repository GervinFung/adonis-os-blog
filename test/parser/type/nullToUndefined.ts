import parseNullableAsDefaultOrUndefined from '../../../src/parser/type/nullToUndefined';

const testNullToUndefinedParser = () =>
    describe('Nullable to default or undefined parser', () => {
        it('should parse a non-null value as default value', () => {
            const obj = { x: 12, y: 34 };
            expect(parseNullableAsDefaultOrUndefined(obj)).toStrictEqual(obj);
            const number = 12;
            expect(parseNullableAsDefaultOrUndefined(number)).toStrictEqual(
                number
            );
        });
        it('should parse nullable value as undefined', () => {
            expect(parseNullableAsDefaultOrUndefined(null)).toBe(undefined);
            expect(parseNullableAsDefaultOrUndefined(undefined)).toBe(
                undefined
            );
        });
    });

export default testNullToUndefinedParser;

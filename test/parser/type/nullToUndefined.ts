import nullableToUndefinedPropsParser from '../../../src/parser/type';

const testNullToUndefinedParser = () =>
    describe('Nullable to default or undefined parser', () => {
        const { parseObject, parseValue, parseAsNonNullable } =
            nullableToUndefinedPropsParser();
        it('should parse a non-null object/value as default object/value', () => {
            const obj = { x: 12, y: 34 };
            expect(parseObject(obj)).toStrictEqual(obj);
            const number = 12;
            expect(parseValue(number)).toBe(number);
        });
        it('should parse nullable properties of an object or value as undefined', () => {
            expect(parseValue(null)).toBeUndefined();
            expect(parseValue(undefined)).toBeUndefined();
            expect(
                parseObject({
                    name: null,
                    age: null,
                    height: null,
                    weight: 100,
                })
            ).toStrictEqual({
                name: undefined,
                age: undefined,
                height: undefined,
                weight: 100,
            });
        });
        it('should parse nullable object as non nullable and throw error otherwise', () => {
            expect(() => parseAsNonNullable(null)).toThrowError();
            expect(() => parseAsNonNullable(undefined)).toThrowError();
            const nonNullableOne = 'jason';
            expect(parseAsNonNullable(nonNullableOne)).toBe(nonNullableOne);
            const nonNullableTwo = {
                age: 123,
            };
            expect(parseAsNonNullable(nonNullableTwo)).toStrictEqual(
                nonNullableTwo
            );
        });
    });

export default testNullToUndefinedParser;

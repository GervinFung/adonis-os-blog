import { isInputNotEmptyOrBlank } from '../../../src/common/validation';

const testValidation = () =>
    describe('Input Validation', () => {
        it('should validate that string is empty or blank', () => {
            expect(isInputNotEmptyOrBlank('')).toBe(false);
            expect(isInputNotEmptyOrBlank(' ')).toBe(false);
        });
        it('should validate that string is not empty or blank', () => {
            expect(isInputNotEmptyOrBlank('asd')).toBe(true);
            expect(isInputNotEmptyOrBlank(' 123 ')).toBe(true);
        });
    });

export default testValidation;

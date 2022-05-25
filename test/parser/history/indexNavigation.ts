import { historyParser } from '../../../src/parser';

const testIndexNavigationParser = () => {
    describe('Index Navigation Parser', () => {
        const parser = historyParser();
        it('should parse indexNavigation', () => {
            const indexNavigation = 100;
            expect(
                parser.parseAsIndexNavigation(
                    JSON.stringify(indexNavigation),
                    10
                )
            ).toBe(indexNavigation);
        });
        it('should failed to parse indexNavigation and return alternative value', () => {
            const alternativeValue = 1;
            expect(
                parser.parseAsIndexNavigation(
                    JSON.stringify('123'),
                    alternativeValue
                )
            ).toBe(alternativeValue);
            expect(
                parser.parseAsIndexNavigation(undefined, alternativeValue)
            ).toBe(alternativeValue);
        });
    });
};

export default testIndexNavigationParser;

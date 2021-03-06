import historyParser from '../../../../src/parser/history';

const testIndexNavigationParser = () =>
    describe('Index Navigation Parser', () => {
        const { parseAsIndexNavigation } = historyParser();
        it('should parse indexNavigation', () => {
            const indexNavigation = 100;
            expect(
                parseAsIndexNavigation(JSON.stringify(indexNavigation), 10)
            ).toBe(indexNavigation);
        });
        it('should failed to parse indexNavigation and return alternative value', () => {
            const alternativeValue = 1;
            expect(
                parseAsIndexNavigation(JSON.stringify('123'), alternativeValue)
            ).toBe(alternativeValue);
            expect(parseAsIndexNavigation(undefined, alternativeValue)).toBe(
                alternativeValue
            );
        });
    });

export default testIndexNavigationParser;

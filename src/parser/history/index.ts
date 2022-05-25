import parseAsStack from './stack';
import parseAsIndexNavigation from './indexNavigation';

const historyPropsParser = () =>
    ({
        parseAsStack,
        parseAsIndexNavigation,
    } as const);

export default historyPropsParser;

import { TestCases } from '.';
import { PublishedPost } from '../../../../../src/common/type/post';
import blogParser from '../../../../../src/parser/blog';

const testPublished = ({
    parseAsValidPost,
    parseInvalidPostThrowError,
    parseAsUndefined,
}: TestCases<PublishedPost>) =>
    describe('Published', () => {
        const {
            one: { parseAsPublishedPost },
        } = blogParser();
        parseAsUndefined(parseAsPublishedPost);
        parseAsValidPost(parseAsPublishedPost);
        parseInvalidPostThrowError(parseAsPublishedPost);
    });

export default testPublished;

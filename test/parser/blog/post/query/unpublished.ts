import { TestCases } from '.';
import { UnpublishedPost } from '../../../../../src/common/type/post';
import blogParser from '../../../../../src/parser/blog';

const testUnpublished = ({
    parseAsValidPost,
    parseInvalidPostThrowError,
    parseAsUndefined,
}: TestCases<UnpublishedPost>) =>
    describe('Unpublished', () => {
        const {
            one: { parseAsUnpublishedPost },
        } = blogParser();
        parseAsUndefined(parseAsUnpublishedPost);
        parseAsValidPost(parseAsUnpublishedPost);
        parseInvalidPostThrowError(parseAsUnpublishedPost);
    });

export default testUnpublished;

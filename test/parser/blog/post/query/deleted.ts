import { TestCases } from '.';
import { DeletedPost } from '../../../../../src/common/type/post';
import blogParser from '../../../../../src/parser/blog';

const testDeleted = ({
    parseAsValidPost,
    parseInvalidPostThrowError,
    parseAsUndefined,
}: TestCases<DeletedPost>) =>
    describe('Deleted', () => {
        const {
            one: { parseAsDeletedPost },
        } = blogParser();
        parseAsUndefined(parseAsDeletedPost);
        parseAsValidPost(parseAsDeletedPost);
        parseInvalidPostThrowError(parseAsDeletedPost);
    });

export default testDeleted;

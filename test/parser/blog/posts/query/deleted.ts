import { TestCases } from '.';
import { DeletedPosts } from '../../../../../src/common/type/post';
import blogParser from '../../../../../src/parser/blog';

const testDeleted = ({
    parseAsValidPosts,
    parseInvalidPostsThrowError,
    parseAsEmptyPosts,
}: TestCases<DeletedPosts>) =>
    describe('Deleted', () => {
        const {
            paginated: { parseAsDeletedPosts },
        } = blogParser();
        parseAsValidPosts(parseAsDeletedPosts);
        parseInvalidPostsThrowError(parseAsDeletedPosts);
        parseAsEmptyPosts(parseAsDeletedPosts);
    });

export default testDeleted;

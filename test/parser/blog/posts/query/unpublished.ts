import { TestCases } from '.';
import { UnpublishedPosts } from '../../../../../src/common/type/post';
import blogParser from '../../../../../src/parser/blog';

const testUnpublished = ({
    parseAsValidPosts,
    parseInvalidPostsThrowError,
    parseAsEmptyPosts,
}: TestCases<UnpublishedPosts>) =>
    describe('Unpublished', () => {
        const {
            paginated: { parseAsUnpublishedPosts },
        } = blogParser();
        parseAsValidPosts(parseAsUnpublishedPosts);
        parseInvalidPostsThrowError(parseAsUnpublishedPosts);
        parseAsEmptyPosts(parseAsUnpublishedPosts);
    });

export default testUnpublished;

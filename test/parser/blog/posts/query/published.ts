import { TestCases } from '.';
import { PublishedPosts } from '../../../../../src/common/type/post';
import blogParser from '../../../../../src/parser/blog';

const testPublished = ({
    parseAsValidPosts,
    parseInvalidPostsThrowError,
    parseAsEmptyPosts,
}: TestCases<PublishedPosts>) =>
    describe('Published', () => {
        const {
            paginated: { parseAsPublishedPosts },
        } = blogParser();
        parseAsValidPosts(parseAsPublishedPosts);
        parseInvalidPostsThrowError(parseAsPublishedPosts);
        parseAsEmptyPosts(parseAsPublishedPosts);
    });

export default testPublished;

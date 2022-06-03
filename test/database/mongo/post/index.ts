import testQueryInsertUpdateDeleteOne from './query-insert-update-delete-one';
import testQueryPaginated from './query-paginated';

const testPost = () =>
    describe('Post', () => {
        testQueryInsertUpdateDeleteOne();
        testQueryPaginated();
    });

export default testPost;

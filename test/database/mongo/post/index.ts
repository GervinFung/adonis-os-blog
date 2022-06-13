import testQueryInsertUpdateOne from './query-insert-update-one';
import testQueryPaginated from './query-paginated';
import testQueryPublishUnpublishDeleteRestore from './query-publish-unpubish-delete-restore-one';

const testPost = () =>
    describe('Post', () => {
        testQueryPublishUnpublishDeleteRestore();
        testQueryInsertUpdateOne();
        testQueryPaginated();
    });

export default testPost;

import testMutatePost from './post';
import testPublishPost from './publish';

const testMutation = () => {
    describe('Mutation', () => {
        testMutatePost();
        testPublishPost();
    });
};

export default testMutation;

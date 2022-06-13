import testInsertUpdate from './insert-update-one';

const testAuthRecord = () =>
    describe('Auth Record', () => {
        testInsertUpdate();
    });

export default testAuthRecord;

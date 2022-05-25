import { InsertPost } from '../../src/common/type';
import mongodb from '../../src/util/api/database/mongo';

const insert = async ({
    content,
    title,
    description,
}: Omit<InsertPost, 'timeCreated'>) => {
    const mongo = await mongodb;
    mongo.insertPost({
        title,
        content,
        description,
        timeCreated: new Date(),
    });
};

export default insert;

import type { NextApiRequest, NextApiResponse } from 'next';
import promisifyMongoDb from '../../../../src/database/mongo';
import cors from '../../../../src/util/api/route/cors';
import parseAsId from '../../../../src/parser/blog/post/id';
import { formObjectIdFromString } from '../../../../src/database/mongo/util';
import { ReadPost } from '../../../../src/common/type/post';

type Response = Readonly<{
    post: ReadPost;
}>;

const index = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { query } = req;
    const id = parseAsId(query.id);
    const { postCollection } = await promisifyMongoDb;
    res.status(200).json({
        post: await postCollection.showOne(formObjectIdFromString(id)),
    });
};

export default index;

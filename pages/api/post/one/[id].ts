import type { NextApiRequest, NextApiResponse } from 'next';
import promisifyMongoDb from '../../../../src/database/mongo';
import cors from '../../../../src/util/api/route/cors';
import { formObjectIdFromString } from '../../../../src/database/mongo/util';
import { ReadPost } from '../../../../src/common/type/post';
import blogPropsParser from '../../../../src/parser/blog';

type Response = Readonly<{
    post: ReadPost;
}>;

const index = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { query } = req;
    const { one } = blogPropsParser();
    const id = one.parseAsId(query.id);
    const { postCollection } = await promisifyMongoDb;
    res.status(200).json({
        post: await postCollection.showOne(formObjectIdFromString(id)),
    });
};

export default index;

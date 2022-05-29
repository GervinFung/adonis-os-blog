import type { NextApiRequest, NextApiResponse } from 'next';
import mongodb from '../../../src/util/api/database/mongo';
import { ReadPost } from '../../../src/common/type/post';
import cors from '../../../src/util/api/route/cors';
import parseAsId from '../../../src/parser/blog/post/id';
import { formObjectIdFromString } from '../../../src/util/api/database/mongo/util';

type Response = Readonly<{
    post: ReadPost;
}>;

const index = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { query } = req;
    const id = parseAsId(query.id);
    const mongo = await mongodb;
    res.status(200).json({
        post: await mongo.showPost(formObjectIdFromString(id)),
    });
};

export default index;

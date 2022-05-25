import type { NextApiRequest, NextApiResponse } from 'next';

import mongodb from '../../../src/util/api/database/mongo';
import { ReadPost } from '../../../src/common/type';
import cors from '../../../src/util/api/route/cors';
import parseAsId from '../../../src/parser/blog/post/id';
import { formObjectIdFromString } from '../../../src/util/api/database/mongo/util';

const index = async (
    req: NextApiRequest,
    res: NextApiResponse<
        Readonly<{
            post: ReadPost;
        }>
    >
) => {
    await cors(req, res);
    const { query } = req;
    const id = parseAsId(query.id);
    const mongo = await mongodb;
    res.status(200).json({
        post: await mongo.showPost(formObjectIdFromString(id)),
    });
};

export default index;

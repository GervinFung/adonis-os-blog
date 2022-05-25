import type { NextApiRequest, NextApiResponse } from 'next';

import mongodb from '../../../src/util/api/database/mongo';
import { ShowPosts } from '../../../src/common/type';
import parseAsPage from '../../../src/parser/blog/posts/page';
import cors from '../../../src/util/api/route/cors';

const index = async (
    req: NextApiRequest,
    res: NextApiResponse<
        Readonly<{
            posts: ShowPosts;
            totalPosts: number;
        }>
    >
) => {
    await cors(req, res);
    const { query } = req;
    const page = parseAsPage(query.page);
    const mongo = await mongodb;
    res.status(200).json({
        posts: await mongo.showPosts({ skip: page - 1 }),
        totalPosts: await mongo.totalPosts(),
    });
};

export default index;

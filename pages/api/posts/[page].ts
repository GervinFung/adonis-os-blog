import type { NextApiRequest, NextApiResponse } from 'next';
import mongodb from '../../../src/util/api/database/mongo';
import { ShowPosts } from '../../../src/common/type/post';
import parseAsPage from '../../../src/parser/blog/posts/page';
import cors from '../../../src/util/api/route/cors';

type Response = Readonly<{
    posts: ShowPosts;
    totalPosts: number;
}>;

const index = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { query } = req;
    const page = parseAsPage(query.page);
    const mongo = await mongodb;
    res.status(200).json({
        posts: await mongo.showPosts({ skip: page - 1 }),
        totalPosts: await mongo.totalPosts(),
    });
};

export default index;

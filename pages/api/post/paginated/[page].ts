import type { NextApiRequest, NextApiResponse } from 'next';
import promisifyMongoDb from '../../../../src/database/mongo';
import { ShowPosts } from '../../../../src/common/type/post';
import blogPropsParser from '../../../../src/parser/blog';
import cors from '../../../../src/util/api/route/cors';

type Response = Readonly<{
    posts: ShowPosts;
    totalPosts: number;
}>;

const index = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { query } = req;
    const { paginated } = blogPropsParser();
    const page = paginated.parseAsPage(query.page);
    const { postCollection } = await promisifyMongoDb;
    res.status(200).json({
        posts: await postCollection.showManyPublishedOnly({
            skip: page - 1,
        }),
        totalPosts: await postCollection.totalPosts(),
    });
};

export default index;

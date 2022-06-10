import type { NextApiRequest, NextApiResponse } from 'next';
import promisifyMongoDb from '../../../../src/database/mongo';
import cors from '../../../../src/util/api/route/cors';
import { formObjectIdFromString } from '../../../../src/database/mongo/util';
import { UserReadPublishedPost } from '../../../../src/common/type/post';
import blogPropsParser from '../../../../src/parser/blog';

type Response = UserReadPublishedPost;

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { query } = req;
    const { postCollection } = await promisifyMongoDb;
    res.status(200).json({
        post: await postCollection.showPublishedOne(
            formObjectIdFromString(blogPropsParser().one.parseAsId(query.id))
        ),
    });
};

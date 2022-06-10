import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../../../src/util/api/route/cors';
import auth from '../../../../../src/auth/api';
import adminPropsParser from '../../../../../src/parser/admin';
import promisifyMongoDb from '../../../../../src/database/mongo';
import blogPropsParser from '../../../../../src/parser/blog';
import { ObjectId } from 'mongodb';

type Response = Readonly<{
    message: string;
}>;

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { body, query } = req;

    await auth.verifyIdToken(adminPropsParser().auth.parseAsToken(body.token));

    const id = blogPropsParser().one.parseAsId(query.id);

    const mongo = await promisifyMongoDb;
    const deletedId = await mongo.postCollection.deleteOne(new ObjectId(id));

    res.status(200).json({
        message: `Deleted post ${deletedId.toHexString()}`,
    });
};

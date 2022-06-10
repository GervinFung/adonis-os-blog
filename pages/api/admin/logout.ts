import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/util/api/route/cors';
import auth from '../../../src/auth/api';
import adminPropsParser from '../../../src/parser/admin';
import promisifyMongoDb from '../../../src/database/mongo';
import { Aud } from '../../../src/common/type/auth-record';

type Response = Readonly<{
    message: string;
}>;

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { body } = req;

    const verifiedId = await auth.verifyIdToken(
        adminPropsParser().auth.parseAsToken(body.token)
    );
    const mongo = await promisifyMongoDb;
    const { aud, uid, auth_time: authTime } = verifiedId;

    await mongo.authRecordCollection.updateOne(
        {
            authTime,
            uid,
            aud: aud as Aud,
        },
        {
            timeLoggedOut: new Date(),
        }
    );

    res.status(200).json({
        message: 'valid',
    });
};

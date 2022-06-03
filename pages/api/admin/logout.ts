import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/util/api/route/cors';
import auth from '../../../src/auth/api';
import parser from '../../../src/parser/admin/auth';
import promisifyMongoDb from '../../../src/database/mongo';
import { Aud } from '../../../src/common/type/auth-record';

type Response = Readonly<{
    message: string;
}>;

const index = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await cors<Response>()(req, res);
    const { body } = req;
    const token = parser.parseAsToken(body.token);

    if (!token) {
        res.status(400).json({
            message: `token is ${token} and is not a valid token`,
        });
        return;
    }

    const verifiedId = await auth.verifyIdToken(token);
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

export default index;
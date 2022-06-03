import { Collection, ObjectId, Document } from 'mongodb';
import {
    FilterForUpdateAuth,
    InsertAuth,
    UpdateAuth,
} from '../../common/type/auth-record';
import { assertUpdateOneComplete } from './util';

const authRecordCollection = (getAuthRecord: () => Collection<Document>) => {
    return {
        // testing purpose only
        clear: async () => await getAuthRecord().deleteMany({}),
        insertOne: async (auth: InsertAuth): Promise<ObjectId> => {
            const { acknowledged, insertedId } =
                await getAuthRecord().insertOne(auth);
            if (!acknowledged) {
                throw new Error(`Insert login ${auth} failed`);
            }
            return insertedId;
        },
        updateOne: async (
            filter: FilterForUpdateAuth,
            { timeLoggedOut }: UpdateAuth
        ) =>
            assertUpdateOneComplete(
                await getAuthRecord().updateOne(
                    {
                        ...filter,
                        timeLoggedOut: undefined,
                    },
                    {
                        $set: {
                            timeLoggedOut,
                        },
                    }
                ),
                {
                    debugInfo: filter,
                    infoToReturn: filter.authTime,
                }
            ),
    } as const;
};

export default authRecordCollection;

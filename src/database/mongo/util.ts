import { ObjectId, UpdateResult } from 'mongodb';

const formObjectIdFromString = (id: string) => new ObjectId(id.trim());

const assertUpdateOneComplete = <T>(
    {
        acknowledged,
        matchedCount,
        modifiedCount,
        upsertedId,
        upsertedCount,
    }: UpdateResult,
    {
        debugInfo,
        infoToReturn,
    }: Readonly<{
        debugInfo: any;
        infoToReturn: T;
    }>
) => {
    if (!acknowledged) {
        throw new Error(`Update failed for ${debugInfo}`);
    }
    const isUpdateOneRow =
        matchedCount === modifiedCount &&
        modifiedCount === 1 &&
        upsertedCount === 0 &&
        upsertedId === null;
    if (!isUpdateOneRow) {
        throw new Error(`There are duplicated rows for ${debugInfo}`);
    }
    return infoToReturn;
};

export { formObjectIdFromString, assertUpdateOneComplete };

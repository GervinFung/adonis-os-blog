import { ObjectId } from 'mongodb';

const formObjectIdFromString = (id: string) => new ObjectId(id.trim());

export { formObjectIdFromString };

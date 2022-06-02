import { ObjectId } from 'mongodb';
import { DummyData } from '.';
import promisifyMongoDb from '../../../../src/database/mongo';

const testPostQuery = (dummyData: DummyData) =>
    describe('Post', () => {
        const dummyPostFromIndex = (index: number) => {
            const contentIndex = `Content ${index}`;
            const postOne = dummyData.find(
                (data) => data.content === contentIndex
            );
            if (!postOne) {
                throw new Error(`post for ${contentIndex}`);
            }
            const { _id, content, description, title, timePublished } = postOne;
            return {
                _id,
                content,
                description,
                title,
                timePublished,
            } as const;
        };
        it('should throw error for querying post with non-existent id', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(
                postCollection.showOne(new ObjectId())
            ).rejects.toThrowError();
        });
        it('should throw error for post with id and undefined published time', async () => {
            const { postCollection } = await promisifyMongoDb;
            expect(
                postCollection.showOne(dummyPostFromIndex(19)._id)
            ).rejects.toThrowError();
        });
        it('should query post with id', async () => {
            const { postCollection } = await promisifyMongoDb;
            const removeId = ({
                content,
                description,
                title,
                timePublished,
            }: Readonly<{
                _id: ObjectId;
                content: string;
                description: string;
                title: string;
                timePublished: Date | undefined;
            }>) => ({
                content,
                description,
                title,
                timePublished,
            });
            const postOne = dummyPostFromIndex(1);
            expect(await postCollection.showOne(postOne._id)).toStrictEqual(
                removeId(postOne)
            );
            const postTwo = dummyPostFromIndex(2);
            expect(await postCollection.showOne(postTwo._id)).toStrictEqual(
                removeId(postTwo)
            );
        });
    });

export default testPostQuery;

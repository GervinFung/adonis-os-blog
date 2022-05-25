import { ObjectId } from 'mongodb';
import { DummyData } from '.';
import mongodb from '../../../../../../src/util/api/database/mongo';

const testPostQuery = (dummyData: DummyData) =>
    describe('Post', () => {
        const post = (index: number) => {
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
            const mongo = await mongodb;
            expect(mongo.showPost(new ObjectId())).rejects.toThrowError();
        });
        it('should throw error for post with id and undefined published time', async () => {
            const mongo = await mongodb;
            expect(mongo.showPost(post(19)._id)).rejects.toThrowError();
        });
        it('should query post with id', async () => {
            const mongo = await mongodb;
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
            const postOne = post(1);
            expect(await mongo.showPost(postOne._id)).toStrictEqual(
                removeId(postOne)
            );
            const postTwo = post(2);
            expect(await mongo.showPost(postTwo._id)).toStrictEqual(
                removeId(postTwo)
            );
        });
    });

export default testPostQuery;

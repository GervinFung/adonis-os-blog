import { ObjectId } from 'mongodb';
import { DummyData } from '.';
import mongodb from '../../../../../../src/util/api/database/mongo';

const testPostQuery = (dummyData: DummyData) =>
    describe('Post', () => {
        it('should query post with id', async () => {
            const mongo = await mongodb;
            const post = (index: number) => {
                const contentOne = `Content ${index}`;
                const postOne = dummyData.find(
                    (data) => data.content === contentOne
                );
                if (!postOne) {
                    throw new Error(`post for ${contentOne}`);
                }
                const { _id, content, description, title, timePublished } =
                    postOne;
                return {
                    _id,
                    content,
                    description,
                    title,
                    timePublished,
                } as const;
            };
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
                timePublished: Date;
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

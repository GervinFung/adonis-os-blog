import { ObjectId } from 'mongodb';
import promisifyMongoDb from '../../../../src/database/mongo';
import nullableToUndefinedPropsParser from '../../../../src/parser/type';

const testQueryPublishUnpublishDeleteRestore = () =>
    describe('Query, Publish, Unpublish, Delete and Restore', () => {
        const dummyDataOne = {
            content: 'Hello Eillie',
            description: 'Hello to a friend of mine',
            title: 'A friend',
            timeCreated: new Date(),
        };
        beforeEach(async () => {
            const { postCollection } = await promisifyMongoDb;
            await postCollection.clear();
        });
        it('should fail and throw error for querying with non-existent id', async () => {
            const { postCollection } = await promisifyMongoDb;
            const id = new ObjectId();
            expect(postCollection.showPublishedOne(id)).rejects.toThrowError();
            expect(
                postCollection.showUnpublishedOne(id)
            ).rejects.toThrowError();
            expect(postCollection.showDeletedOne(id)).rejects.toThrowError();
        });
        const { parseAsNonNullable } = nullableToUndefinedPropsParser();
        it('should query published, unpublished, post, fail to query post with conditions that are not fulfilled', async () => {
            const { postCollection } = await promisifyMongoDb;
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);

            // 1. Before publishing it, it will be treated as unpublished
            // unpublish
            const {
                timeCreated: initialAsUnpublishTimeCreated,
                ...initialAsUnpublishPostProps
            } = parseAsNonNullable(
                await postCollection.showUnpublishedOne(insertedIdOne)
            );
            expect(initialAsUnpublishTimeCreated).toBeTruthy();
            expect({
                ...initialAsUnpublishPostProps,
            }).toStrictEqual({
                title: dummyDataOne.title,
                description: dummyDataOne.description,
                content: dummyDataOne.content,
            });
            // publish
            expect(
                await postCollection.showPublishedOne(insertedIdOne)
            ).toBeUndefined();
            // deleted
            expect(
                await postCollection.showDeletedOne(insertedIdOne)
            ).toBeUndefined();

            // 2. After publishing it, it will be treated as published
            // publish it
            await postCollection.publishOne(insertedIdOne);
            // publish
            const { timePublished, ...publishedPostProps } = parseAsNonNullable(
                await postCollection.showPublishedOne(insertedIdOne)
            );
            expect(timePublished).toBeTruthy();
            expect(publishedPostProps).toStrictEqual({
                title: dummyDataOne.title,
                description: dummyDataOne.description,
                content: dummyDataOne.content,
            });
            // unpublish
            expect(
                await postCollection.showUnpublishedOne(insertedIdOne)
            ).toBeUndefined();
            // deleted
            expect(
                await postCollection.showDeletedOne(insertedIdOne)
            ).toBeUndefined();

            // 3. After unpublishing it, it will be treated as unpublished
            // unpublish it
            await postCollection.unpublishOne(insertedIdOne);
            // unpublish
            const {
                timeCreated: unpublishedTimeCreated,
                ...unpublishedPostProps
            } = parseAsNonNullable(
                await postCollection.showUnpublishedOne(insertedIdOne)
            );
            expect(unpublishedTimeCreated).toBeTruthy();
            expect({
                ...unpublishedPostProps,
            }).toStrictEqual({
                title: dummyDataOne.title,
                description: dummyDataOne.description,
                content: dummyDataOne.content,
            });
            // publish
            expect(
                await postCollection.showPublishedOne(insertedIdOne)
            ).toBeUndefined();
            // deleted
            expect(
                await postCollection.showDeletedOne(insertedIdOne)
            ).toBeUndefined();
        });
        it('should query deleted and restored or existed post, fail to query post with conditions that are not fulfilled', async () => {
            const { postCollection } = await promisifyMongoDb;
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);

            const expectedCommonProps = {
                title: dummyDataOne.title,
                description: dummyDataOne.description,
                content: dummyDataOne.content,
            };

            // 1. After deleting it, it will be treated as deleted
            // delete it
            await postCollection.deleteOne(insertedIdOne);
            // publish
            expect(
                await postCollection.showPublishedOne(insertedIdOne)
            ).toBeUndefined();
            // unpublish
            expect(
                await postCollection.showUnpublishedOne(insertedIdOne)
            ).toBeUndefined();
            // deleted
            const { timeDeleted, ...deletedPostProps } = parseAsNonNullable(
                await postCollection.showDeletedOne(insertedIdOne)
            );
            expect(timeDeleted).toBeTruthy();
            expect({
                ...deletedPostProps,
            }).toStrictEqual(expectedCommonProps);

            // 2. After restoring it, it will be treated as restore
            // unpublish it
            await postCollection.restoreOne(insertedIdOne);
            // publish
            expect(
                await postCollection.showPublishedOne(insertedIdOne)
            ).toBeUndefined();
            // unpublish
            const { timeCreated, ...unpublishedPostProps } = parseAsNonNullable(
                await postCollection.showUnpublishedOne(insertedIdOne)
            );
            expect(timeCreated).toBeTruthy();
            expect(unpublishedPostProps).toStrictEqual(expectedCommonProps);
            // deleted
            expect(
                await postCollection.showDeletedOne(insertedIdOne)
            ).toBeUndefined();
        });
        it('should delete and restore a post, fail to delete or update an already deleted post and restore an already restored post', async () => {
            const { postCollection } = await promisifyMongoDb;
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);

            // delete
            expect(
                (await postCollection.deleteOne(insertedIdOne)).toHexString()
            ).toBe(insertedIdOne.toHexString());

            // delete a deleted post
            expect(
                postCollection.deleteOne(insertedIdOne)
            ).rejects.toThrowError();

            // restore
            expect(
                (await postCollection.restoreOne(insertedIdOne)).toHexString()
            ).toBe(insertedIdOne.toHexString());

            // restore a restored post
            expect(
                postCollection.restoreOne(insertedIdOne)
            ).rejects.toThrowError();
        });
        it('should publish, unpublish a post, fail to unpublish or query an already unpublished post and publish an already published post', async () => {
            const { postCollection } = await promisifyMongoDb;
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);

            // publish
            expect(
                (await postCollection.publishOne(insertedIdOne)).toHexString()
            ).toBe(insertedIdOne.toHexString());

            // publish a published post
            expect(
                postCollection.publishOne(insertedIdOne)
            ).rejects.toThrowError();

            // unpublish
            expect(
                (await postCollection.unpublishOne(insertedIdOne)).toHexString()
            ).toBe(insertedIdOne.toHexString());

            // unpublish a unpublished post
            expect(
                postCollection.unpublishOne(insertedIdOne)
            ).rejects.toThrowError();
        });
        it('should fail to update, publish and unpublish a deleted post', async () => {
            const { postCollection } = await promisifyMongoDb;
            const insertedIdOne = await postCollection.insertOne(dummyDataOne);

            // delete
            expect(
                (await postCollection.deleteOne(insertedIdOne)).toHexString()
            ).toBe(insertedIdOne.toHexString());

            // publish
            expect(
                postCollection.publishOne(insertedIdOne)
            ).rejects.toThrowError();

            // unpublish;
            expect(
                postCollection.unpublishOne(insertedIdOne)
            ).rejects.toThrowError();
        });
    });

export default testQueryPublishUnpublishDeleteRestore;

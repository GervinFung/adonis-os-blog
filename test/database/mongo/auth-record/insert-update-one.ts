import promisifyMongoDb from '../../../../src/database/mongo';

const testInsertUpdate = () =>
    describe('Insert and Update', () => {
        beforeEach(async () => {
            const { authRecordCollection } = await promisifyMongoDb;
            await authRecordCollection.clear();
        });
        it('should query, insert, update auth record with defined email', async () => {
            const { authRecordCollection } = await promisifyMongoDb;

            const dataOne = {
                aud: 'adonis-os-blog-local',
                email: 'random@gmail.com',
                timeCreated: new Date(),
                type: 'email-defined',
                uid: 'unique-id',
                authTime: 1,
            } as const;

            const dataTwo = {
                aud: 'adonis-os-blog-local',
                email: 'random@gmail.com',
                timeCreated: new Date(),
                type: 'email-defined',
                uid: 'unique-id',
                authTime: 2,
            } as const;

            expect(
                (await authRecordCollection.insertOne(dataOne)).toHexString()
            ).toBeTruthy();

            expect(
                (await authRecordCollection.insertOne(dataTwo)).toHexString()
            ).toBeTruthy();

            expect(
                await authRecordCollection.updateOne(
                    {
                        aud: dataTwo.aud,
                        uid: dataTwo.uid,
                        authTime: dataTwo.authTime,
                    },
                    {
                        timeLoggedOut: new Date(),
                    }
                )
            ).toBe(dataTwo.authTime);
        });
        it('should query, insert, update auth record with undefined email', async () => {
            const { authRecordCollection } = await promisifyMongoDb;

            const data = {
                aud: 'adonis-os-blog-local',
                timeCreated: new Date(),
                type: 'email-undefined',
                uid: 'unique-id',
                authTime: 1,
            } as const;

            expect(
                (await authRecordCollection.insertOne(data)).toHexString()
            ).toBeTruthy();

            expect(
                await authRecordCollection.updateOne(
                    {
                        aud: data.aud,
                        uid: data.uid,
                        authTime: data.authTime,
                    },
                    {
                        timeLoggedOut: new Date(),
                    }
                )
            ).toBe(data.authTime);
        });
    });

export default testInsertUpdate;

import commandLine from '../command';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import promifisyMongoDb from '../../src/database/mongo';
import postOpetaionParser from '../parser/post';
import { QueryUpdatePost } from '../../src/common/type/post';

type FileOperationType = 'insert' | 'update';

const main = (args: ReadonlyArray<string>) => {
    const genMarkdownFile = (type: FileOperationType) =>
        `post/${type}/content.md`;

    const genJsonFile = (type: FileOperationType) => `post/${type}/post.json`;

    const writeMarkdownFile = (
        content: string | undefined,
        type: FileOperationType
    ) => {
        const fileName = genMarkdownFile(type);
        fs.writeFile(fileName, content ?? '', (error) =>
            error ? console.error(error) : console.log(`${fileName} created`)
        );
    };

    const writeJsonFile = (
        data:
            | QueryUpdatePost
            | Readonly<{
                  title: string;
                  description: string;
                  content: string;
              }>,
        type: FileOperationType
    ) => {
        const fileName = genJsonFile(type);
        fs.writeFile(fileName, JSON.stringify(data, null, 4), (error) =>
            error ? console.error(error) : console.log(`${fileName} created`)
        );
    };

    const readFileContent = (files: string): Promise<string> =>
        new Promise((resolve, reject) => {
            let fetchData = '';
            fs.createReadStream(files)
                .on('data', (data) => {
                    fetchData = data.toString();
                })
                .on('end', () => resolve(fetchData))
                .on('error', reject);
        });

    const { parseAsUpdatePost, parseAsInsertPost } = postOpetaionParser();

    const mkdir = (directory: string) => {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
    };

    commandLine().yargs({
        args,
        read: async () => {
            const mongo = await promifisyMongoDb;
            const posts = await mongo.postCollection.showAllPosts();
            const directory = 'post/read';
            mkdir(directory);
            const path = `${directory}/posts.json`;
            fs.writeFile(path, JSON.stringify(posts, null, 4), (error) =>
                error
                    ? console.error(error)
                    : console.log(`Wrote all posts to ${path}`)
            );
            await mongo.close();
        },
        publish: async (argv) => {
            const id = new ObjectId(argv.id);
            const mongo = await promifisyMongoDb;
            const publishedId = await mongo.postCollection.publishOne(id);
            if (publishedId.toHexString() !== id.toHexString()) {
                throw new Error(`Publish failed for ${id}`);
            }
            console.log(`Published blog ${publishedId}`);
            await mongo.close();
        },
        softDelete: async (argv) => {
            const id = new ObjectId(argv.id);
            const mongo = await promifisyMongoDb;
            const deletedId = await mongo.postCollection.deleteOne(id);
            if (deletedId.toHexString() !== id.toHexString()) {
                throw new Error(`Delete failed for ${id}`);
            }
            console.log(`Soft deleted blog ${deletedId}`);
            await mongo.close();
        },
        insert: (() => {
            const insert = 'insert';
            return {
                template: () => {
                    mkdir(`post/${insert}`);
                    writeMarkdownFile('# Write some stuff mate', insert);
                    writeJsonFile(
                        {
                            title: 'Title',
                            description: 'Description',
                            content: 'Content',
                        },
                        insert
                    );
                },
                action: async () => {
                    const postJson = parseAsInsertPost(
                        JSON.parse(await readFileContent(genJsonFile(insert)))
                    );
                    const postMarkdown = await readFileContent(
                        genMarkdownFile(insert)
                    );
                    const mongo = await promifisyMongoDb;
                    const insertedId = await mongo.postCollection.insertOne({
                        ...postJson,
                        content: postMarkdown,
                        timeCreated: new Date(),
                    });
                    if (!insertedId.toHexString()) {
                        throw new Error(`Insertion failed for ${insertedId}`);
                    }
                    console.log(`Inserted new blog ${insertedId}`);
                    await mongo.close();
                },
            };
        })(),
        update: (() => {
            const update = 'update';
            return {
                template: async (argv) => {
                    const mongo = await promifisyMongoDb;
                    const postToBeUpdated =
                        await mongo.postCollection.showPostToBeUpdated(
                            new ObjectId(argv.id)
                        );
                    mkdir(`post/${update}`);
                    writeMarkdownFile(postToBeUpdated.content, update);
                    writeJsonFile(postToBeUpdated, update);
                },
                action: async () => {
                    const postJson = parseAsUpdatePost(
                        JSON.parse(await readFileContent(genJsonFile(update)))
                    );
                    const { id } = postJson;
                    const postMarkdown = await readFileContent(
                        genMarkdownFile(update)
                    );
                    const mongo = await promifisyMongoDb;
                    const updatedId = await mongo.postCollection.updateOne(id, {
                        ...postJson,
                        content: postMarkdown,
                        timeUpdated: new Date(),
                    });
                    if (updatedId.toHexString() !== id.toHexString()) {
                        throw new Error(`Update failed for ${id}`);
                    }
                    console.log(`Updated blog ${id}`);
                    await mongo.close();
                },
            };
        })(),
    });
};

export default main;

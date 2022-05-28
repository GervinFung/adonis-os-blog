import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

type Id = Readonly<{
    id: string;
}>;

const commandLine = () => {
    return {
        yargs: ({
            args,
            insert,
            update,
            softDelete,
            publish,
            read,
        }: Readonly<{
            args: ReadonlyArray<string>;
            insert: Readonly<{
                action: () => void;
                template: () => void;
            }>;
            update: Readonly<{
                action: () => void;
                template: (args: yargs.ArgumentsCamelCase<Id>) => void;
            }>;
            softDelete: (args: yargs.ArgumentsCamelCase<Id>) => void;
            publish: (args: yargs.ArgumentsCamelCase<Id>) => void;
            read: () => void;
        }>) =>
            yargs(hideBin(Array.from(args)))
                .version('0.0.1')
                .usage('A CLI for managing adonis blog post')
                .command({
                    command: 'read',
                    describe: 'Read All Existing Posts',
                    handler: read,
                })
                .command({
                    command: 'publish',
                    describe: 'Publish Existing Post',
                    handler: publish,
                    builder: {
                        id: {
                            describe: 'The id of the post to be published',
                            demandOption: true,
                            type: 'string',
                        },
                    },
                })
                .command({
                    command: 'insert-template',
                    describe: 'Generate templalte to insert new post',
                    handler: insert.template,
                })
                .command({
                    command: 'insert',
                    describe: 'Insert New Post',
                    handler: insert.action,
                })
                .command({
                    command: 'update-template',
                    describe: 'Generate templalte to update existing post',
                    handler: update.template,
                    builder: {
                        id: {
                            describe: 'The id of the post to be updated',
                            demandOption: true,
                            type: 'string',
                        },
                    },
                })
                .command({
                    command: 'update',
                    describe: 'Update Existing Post',
                    handler: update.action,
                })
                .command({
                    command: 'delete',
                    describe: 'Soft Delete Existing Post',
                    handler: softDelete,
                    builder: {
                        id: {
                            describe: 'The id of the post to be deleted',
                            demandOption: true,
                            type: 'string',
                        },
                    },
                })
                .help()
                .strict().argv,
    } as const;
};

export default commandLine;

import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { parseAsCustomType } from 'parse-dont-validate';

((args) => {
    const describe = 'Generate .env file based on environment';
    yargs(hideBin(args))
        .usage(describe)
        .command({
            command: 'generate',
            describe,
            builder: {
                env: {
                    describe: 'The environment specified',
                    demandOption: true,
                    type: 'string',
                },
            },
            handler: (argv) => {
                const env = parseAsCustomType(
                    argv.env,
                    (env) =>
                        env === 'development' ||
                        env === 'staging' ||
                        env === 'production'
                ).orElseThrowDefault('env');
                const file = `${process.cwd()}/.env.${env}`;
                fs.readFile(file, undefined, (error, data) => {
                    if (error) {
                        console.error(error);
                    }
                    const targetFile = `${process.cwd()}/.env`;
                    fs.writeFile(targetFile, data, (error) =>
                        error
                            ? console.error(error)
                            : console.log(`Wrote to ${targetFile}`)
                    );
                });
            },
        })
        .help()
        .strict().argv;
})(process.argv);

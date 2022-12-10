import { cac } from 'cac';
import { resolve } from 'path';
import { createDevServer } from './dev';
import { build } from './build';
import { PACKAGE_PATH } from './constants';

const version = require('../../package.json').version;
const cli = cac('lg').version(version).help();

cli
  .command('[root]', 'start server')
  .alias('dev')
  .action(async (root: string) => {
    root = resolve(PACKAGE_PATH, root);
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
  });

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    root = resolve(root);
    await build(root);
  });

cli.parse();

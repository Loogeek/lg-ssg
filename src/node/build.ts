import { build as viteBuild, InlineConfig } from 'vite';
import { join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import pluginReact from '@vitejs/plugin-react';
import { pathToFileURL } from 'url';

import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants/index';

export async function bundle(root = process.cwd()) {
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    plugins: [pluginReact()],
    build: {
      ssr: isServer,
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  });

  console.log('Building client + server bundles...');

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      // client build
      viteBuild(resolveViteConfig(false)),
      // server build
      viteBuild(resolveViteConfig(true))
    ]);

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.error(error);
  }
}

async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );

  console.log('Rendering page in server side...');
  const appHtml = render();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    
    <body>
      <div id="root">${appHtml}</div>
      <script type="module" src="/${clientChunk?.fileName}"></script>
    </body>
    
    </html>
    `;
  await fs.ensureDir(join(root, 'build'));
  await fs.writeFile(join(root, 'build/index.html'), html);
  await fs.remove(join(root, '.temp'));
}

export async function build(root: string) {
  // 1. bundle - client 端 + server 端
  const [clientBundle] = await bundle(root);
  // 2. 加载ssr入口
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  // 2. ssr -> html
  await renderPage(render, root, clientBundle);
}

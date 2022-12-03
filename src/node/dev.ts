import { createServer as createViteServer } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { pluginIndexHtml } from '../plugin/index-html';

export async function createDevServer(root = process.cwd()) {
  return createViteServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}

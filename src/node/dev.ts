import { createServer as createViteServer } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { pluginIndexHtml } from '../plugin/index-html';
import { resolveConfig } from './config';

export async function createDevServer(root = process.cwd()) {
  const config = await resolveConfig(root, 'serve', 'development');

  return createViteServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}

import { createServer as createViteServer } from 'vite'

export async function createDevServer(root = process.cwd()) {
  return createViteServer({
    root
  })
}
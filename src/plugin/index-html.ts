import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { DEFAULT_HTML_PATH,CLIENT_ENTRY_PATH } from "../node/constants";

export function pluginIndexHtml(): Plugin {
  return {
    name: "island:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `${CLIENT_ENTRY_PATH}`,
            },
            injectTo: "body",
          },
        ],
      }
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          try {
            let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
            html = await server.transformIndexHtml(
              req.url, 
              html, 
              req.originalUrl
            )
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    },
  };
}


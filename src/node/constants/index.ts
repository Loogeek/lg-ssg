import { join } from "path";

export const PACKAGE_PATH = join(__dirname, "..");

export const DEFAULT_HTML_PATH = join(PACKAGE_PATH, "template.html");

export const CLIENT_ENTRY_PATH = join(
  PACKAGE_PATH,
  "src",
  "runtime",
  "client-entry.tsx"
);

export const SERVER_ENTRY_PATH = join(
  PACKAGE_PATH,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

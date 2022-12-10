import { resolve } from 'path';
import fs from 'fs';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/types';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

export function getUserConfigPath(root: string) {
  const supportConfigFiles = ['config.ts', 'config.js'];
  const configPath = supportConfigFiles
    .map((file) => {
      return resolve(root, file);
    })
    .find(fs.existsSync);

  return configPath;
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  // 1.  获取配置文件路径
  const configPath = getUserConfigPath(root);

  // 2.  获取配置内容
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}

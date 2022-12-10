import { UserConfig as ViteUserConfig } from 'vite';

export interface NavItemWithLink {
  text: string;
  link: string;
}

export type SliderItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SliderItem[] };

export interface SliderGroup {
  text?: string;
  items: SliderItem[];
}

export interface SliderBar {
  [path: string]: SliderGroup;
}

export interface Footer {
  message?: string;
  copyright?: string;
}

export interface ThemeConfig {
  nav?: NavItemWithLink[];
  sliderBar?: SliderBar;
  footer: Footer;
}

export interface UserConfig {
  title?: string;
  description?: string;
  vite?: ViteUserConfig;
  theme?: ThemeConfig;
}

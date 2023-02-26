import type UToolsApi from 'utools-api-types';
import type { BrowserWindowConstructorOptions } from 'electron';

declare type CustomUToolsApi = UToolsApi & {
  createBrowserWindow(
    url: string,
    options: BrowserWindowConstructorOptions,
    callback?: () => void
  ): {
    id: number;
    [key: string]: any;
    webContents: { id: number; [key: string]: any };
  };
};
declare var utools: CustomUToolsApi;

// export = utools;

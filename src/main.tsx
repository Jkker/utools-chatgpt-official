import {
  ChakraProvider,
  ChakraProviderProps,
  ColorMode,
  ColorModeWithSystem,
  ThemeOverride,
  extendTheme,
} from '@chakra-ui/react';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ChatGPT';
import { CHATGPT_GRAY } from './constants';

const key = 'colorMode';

const uToolsColorManger: ChakraProviderProps['colorModeManager'] = {
  get: (init: ColorMode) => {
    const color = utools.dbStorage.getItem(key) ?? init;
    console.log('getColorMode', color);
    return color;
  },
  set: (value: ColorModeWithSystem) => {
    console.log('setColorMode', value);
    utools.dbStorage.setItem(key, value);
  },
  type: 'localStorage',
};

const themeConfig: ThemeOverride = {
  colors: {
    gray: CHATGPT_GRAY,
  },
  fonts: {
    heading: `Lexend, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    body: `Lexend, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    mono: `'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', -apple-system, sans-serif`,
  },
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
};

const theme = extendTheme(themeConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme} colorModeManager={uToolsColorManger}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

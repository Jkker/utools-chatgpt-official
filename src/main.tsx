import { ChakraProvider, extendTheme, ThemeOverride } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CHATGPT_GRAY } from './constants';
import App from './ChatGPT';
// import App from './Dev';
// import App from './components/Editor';
// import App from './components/PromptManager';
// import App from './components/SnippetManager';
// import { DevSettingsModal as App } from './components/SettingsModal';

const themeConfig: ThemeOverride = {
  colors: {
    gray: CHATGPT_GRAY,
  },
  fonts: {
    heading: `Lexend, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    body: `Lexend, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    mono: `'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace, -apple-system, sans-serif`,
  },
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
};

const theme = extendTheme(themeConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

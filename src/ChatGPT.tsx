import {
  ColorModeWithSystem,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import type { ContextMenuEvent } from 'electron';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ContextMenu, {
  ExtendedContextMenuParams as CtxParams,
} from './components/ContextMenu';
import { PromptEditor } from './components/Editor';
import { SettingsModal } from './components/Settings';
import ToolBar from './components/ToolBar';
import {
  CHAT_GPT_URL,
  GPT3_5_MAX_TOKENS,
  GPT4_MAX_TOKENS,
  KEYBOARD_SHORTCUTS,
  SELECTORS,
} from './constants';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { useSettings } from './hooks/useSettings';
import cleanupCSS from './scripts/chatgpt-cleanup.css?raw';
import contentScript from './scripts/chatgpt-content-script.js?raw';
import hljsTheme from './scripts/hljs-monokai-pro.css?raw';
import { getTokenCount } from './utils/tokenCount';

import { createCustomActions } from './config/hotkeys';

import { useActions, ActionsContext } from './actions/context';

function App() {
  const webviewRef = useRef<Electron.WebviewTag & HTMLWebViewElement>(null);
  const toast = useToast();
  const [webviewInitialized, setWebviewInitialized] = useState(false);
  const [ctxParams, setCtxParams] = useState<CtxParams>({} as CtxParams);
  const [isPinned, setIsPinned] = useState(window.API?.isPinned ?? false);
  const { setColorMode, colorMode } = useColorMode();

  const pref = useDisclosure();
  const editor = useDisclosure();
  const ctxMenu = useDisclosure();

  const settings = useSettings();

  const interact = (selector: string, command = 'click()') => {
    return webviewRef.current?.executeJavaScript(
      `(()=>{const e = document.querySelector(${selector});if(e) return e.${command}})();`
    );
  };
  const interactMany = (selectors: string[], command = 'click()') => {
    return webviewRef.current?.executeJavaScript(
      selectors
        .map(
          (selector) =>
            `(()=>document.querySelector(${selector})?.${command})();`
        )
        .join('')
    );
  };
  const exec = (code) => webviewRef.current?.executeJavaScript(code);

  const togglePin = useCallback(() => {
    const isPinned = window.API.togglePin();
    setIsPinned(isPinned);
    toast({
      id: 'togglePin-toast',
      title: isPinned ? settings.T.pinned : settings.T.unpinned,
      status: isPinned ? 'success' : 'info',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
      variant: 'subtle',
    });

    return isPinned;
  }, [settings.T, toast, setIsPinned]);

  const acc = useMemo(
    () =>
      createCustomActions({
        wv: webviewRef.current,
        appURL: CHAT_GPT_URL,
        togglePin,
        toggleWindowDevTools: () => window.API.toggleWindowDevTools(),
      }),
    [togglePin]
  );

  const appActions = {
    //* ChatGPT Actions */
    insertText: (text) => webviewRef.current?.insertText(text),
    focusPromptTextarea: () => {
      webviewRef.current?.focus();
      interact(SELECTORS.promptTextarea, 'focus()');
    },
    getPromptText: () =>
      exec(`document.querySelector(${SELECTORS.promptTextarea})?.value`),
    setPromptText: (text) => {
      const encoded = new TextEncoder().encode(text).join(',');
      interact(
        SELECTORS.promptTextarea,
        `value = (new TextDecoder().decode(new Uint8Array('${encoded}'.split(',').map((n) => parseInt(n))).buffer))`
      );
    },
    debouncedSetPromptText: debounce(async (text) => {
      webviewRef.current?.focus();
      await webviewRef.current?.executeJavaScript(
        `(()=>{const t = document.querySelector(${SELECTORS.promptTextarea}); t.value = "";t.focus();})();`
      );
      webviewRef.current?.insertText(text);
    }, 500),

    updateTokenCount: async (prompt?: string) => {
      if (prompt === undefined) prompt = await appActions.getPromptText();
      const tokenCount = prompt.trim() ? getTokenCount(prompt) : 0;
      const currentModel = await interact(SELECTORS.currentModel, 'innerText');
      const tokenLimit =
        currentModel === 'ChatGPT 3.5' ? GPT3_5_MAX_TOKENS : GPT4_MAX_TOKENS;
      const tokenCountDesc =
        `Tokens: ${tokenCount} / ${tokenLimit}` +
        (tokenCount > tokenLimit ? ' ⚠️' : '');
      interact(
        SELECTORS.gptReleaseNotes,
        `replaceChildren('${tokenCountDesc}')`
      ); //working
    },
    saveEditAndSubmit: () => interact(SELECTORS.saveEditSubmitButton),
    submitPrompt: () => interact(SELECTORS.submitPromptButton),
    submitAll: () =>
      interactMany([
        SELECTORS.saveEditSubmitButton,
        SELECTORS.submitPromptButton,
      ]),
  };

  const colorModeActions = {
    getColorMode: () => exec(`localStorage.getItem('theme')`),
    setColorMode: async (mode: ColorModeWithSystem) => {
      if (mode === 'system') {
        mode = utools.isDarkColors() ? 'dark' : 'light';
      }
      await exec(
        `localStorage.setItem('theme', '${mode}');document.documentElement.className = '${mode}';document.documentElement.style.setProperty('color-scheme', '${mode}');`
      );
      setColorMode(mode);
    },
    toggleColorMode: async () => {
      const mode = colorMode === 'dark' ? 'light' : 'dark';
      await exec(
        `localStorage.setItem('theme', '${mode}');document.documentElement.className = '${mode}';document.documentElement.style.setProperty('color-scheme', '${mode}');`
      );
      setColorMode(mode);
    },
  };

  const actions = {
    ...appActions,
    ...colorModeActions,
  };

  useEffect(() => {
    if (webviewInitialized && !editor.isOpen) {
      appActions.focusPromptTextarea();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.isOpen, webviewInitialized]);

  useKeyboardShortcuts(
    Object.entries(KEYBOARD_SHORTCUTS).map(([key, action]) => [
      key,
      actions[action],
    ])
  );

  useEffect(() => {
    if (webviewRef.current) {
      const webview = webviewRef.current;
      const onload = async () => {
        console.log('✅ Webview loaded');
        setWebviewInitialized(true);
        const webViewColorMode = await actions.getColorMode();
        setColorMode(webViewColorMode);
        await exec(
          contentScript
            .replace(`'KEYBOARD_SHORTCUTS'`, JSON.stringify(KEYBOARD_SHORTCUTS))
            .replace(`'IS_MACOS'`, `${utools.isMacOS()}`)
        );
        await webview.insertCSS(cleanupCSS + hljsTheme);
        const queuedInput = window.API.getQueuedInput();
        if (queuedInput && queuedInput.trim()) {
          await appActions.focusPromptTextarea();
          await appActions.insertText(queuedInput);
        }
      };

      const onMessage = async (event: Electron.ConsoleMessageEvent) => {
        if (!event.message.startsWith('!_COMMAND_')) return;
        const [command, payload] = event.message
          .replace('!_COMMAND_', '')
          .split('#^#', 2);
        if (command in actions) {
          console.log(
            `🚀 ~ file: ChatGPT.tsx:248 ~ onMessage ~ action:`,
            command
          );
          actions[command](payload);
        } else console.error(`Unknown command: ${command}(${payload})`);
      };

      const onContextMenu = ({ params }: ContextMenuEvent) => {
        const { width, height } = webview.getBoundingClientRect();
        ctxMenu.onOpen();
        setCtxParams({
          ...params,
          windowHeight: height,
          windowWidth: width,
        } as CtxParams);
      };
      webview.addEventListener('context-menu', onContextMenu);
      webview.addEventListener('console-message', onMessage);
      // webview.addEventListener('new-window', (e) => {
      //   console.log('🖥️ new-window', e);
      //   e.preventDefault();
      //   /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
      //   utools.shellOpenExternal(e.url);
      // });

      webview.addEventListener('did-navigate-in-page', () => {
        onload();
      });
      webview.addEventListener('page-title-updated', (e) => {
        window.API.updatePageTitle(e.title);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ActionsContext.Provider
      value={{
        ...actions,
        ...colorModeActions,
      }}
    >
      <webview
        id="chatgpt"
        src={settings.chatgptURL}
        ref={webviewRef}
        autoFocus
        nodeintegration
        allowpopups
        webpreferences="contextIsolation=false"
      ></webview>
      {webviewRef.current && (
        <>
          <ContextMenu
            params={ctxParams}
            isOpen={ctxMenu.isOpen}
            onClose={ctxMenu.onClose}
            actions={actions}
          />
          <ToolBar
            actions={actions}
            isPinned={isPinned}
            colorMode={colorMode}
            openSettings={pref.onOpen}
            openEditor={editor.onOpen}
          >
            {/* <SearchBar webviewRef={webviewRef} /> */}
          </ToolBar>
          <SettingsModal
            isOpen={pref.isOpen}
            onClose={pref.onClose}
            actions={actions}
          />
          {/* <PromptEditor
            isOpen={isEditorOpen}
            // onOpen={openEditor}
            onClose={closeEditor}
            actions={actions}
          /> */}
        </>
      )}
    </ActionsContext.Provider>
  );
}

export default App;

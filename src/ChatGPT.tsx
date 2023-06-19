import {
  ColorModeWithSystem,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import type { ContextMenuEvent } from 'electron';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { T } from './assets/i18n';
import ContextMenu, {
  ExtendedContextMenuParams as CtxParams,
} from './components/ContextMenu';
import { PromptEditor } from './components/Editor';
import SettingsModal from './components/SettingsModal';
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

function App() {
  const webviewRef = useRef<Electron.WebviewTag & HTMLWebViewElement>(null);
  const toast = useToast();
  const [webviewInitialized, setWebviewInitialized] = useState(false);
  const [ctxParams, setCtxParams] = useState<CtxParams>({} as CtxParams);
  const [isPinned, setIsPinned] = useState(window.API?.isPinned ?? false);
  const { setColorMode, colorMode } = useColorMode();
  const {
    isOpen: isPreferencesOpen,
    onOpen: openPreferences,
    onClose: closePreferences,
    onToggle: togglePreferences,
  } = useDisclosure();
  const {
    isOpen: isEditorOpen,
    onOpen: openEditor,
    onClose: closeEditor,
    onToggle: toggleEditor,
  } = useDisclosure();
  const {
    isOpen: isContextMenuOpen,
    onOpen: openContextMenu,
    onClose: closeContextMenu,
  } = useDisclosure();

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

  const appActions = useMemo(
    () => ({
      //* Window Actions */
      openEditor,
      toggleEditor,
      closeEditor,
      togglePreferences,
      openPreferences,
      closePreferences,
      togglePin: () => {
        const isPinned = window.API.togglePin();
        setIsPinned(isPinned);
        toast({
          id: 'togglePin-toast',
          title: isPinned ? T.pinned : T.unpinned,
          status: isPinned ? 'success' : 'info',
          duration: 2000,
          isClosable: true,
          position: 'bottom-right',
          variant: 'subtle',
        });

        return isPinned;
      },
      toggleWindowDevTools: () => window.API.toggleWindowDevTools(),

      //* Webview Actions */
      focus: () => webviewRef.current?.focus(),
      copy: () => webviewRef.current?.copy(),
      paste: () => webviewRef.current?.paste(),
      cut: () => webviewRef.current?.cut(),
      undo: () => webviewRef.current?.undo(),
      redo: () => webviewRef.current?.redo(),
      replaceMisspelling: (s) => webviewRef.current?.replaceMisspelling(s),
      selectAll: () => webviewRef.current?.selectAll(),
      reload: () => webviewRef.current?.loadURL(CHAT_GPT_URL),
      reloadIgnoringCache: () => webviewRef.current?.reloadIgnoringCache(),
      zoomIn: () =>
        webviewRef.current?.setZoomLevel(
          webviewRef.current?.getZoomLevel() + 1
        ),
      zoomOut: () =>
        webviewRef.current?.setZoomLevel(
          webviewRef.current?.getZoomLevel() - 1
        ),
      zoomReset: () => webviewRef.current?.setZoomLevel(0),
      openDevTools: () => webviewRef.current?.openDevTools(),
      insertText: (text) => webviewRef.current?.insertText(text),

      //* ChatGPT Actions */
      toggleGPTModel: () => interact(SELECTORS.toggleGPTModel),
      toggleSidebar: () => interact(SELECTORS.toggleSidebar),
      focusPromptTextarea: () => {
        appActions.focus();
        interact(SELECTORS.promptTextarea, 'focus()');
      },
      blurPromptTextarea: () => interact(SELECTORS.promptTextarea, 'blur()'),
      getPromptText: () =>
        exec(`document.querySelector(${SELECTORS.promptTextarea})?.value`),
      setPromptText: (text) => {
        const encoded = new TextEncoder().encode(text).join(',');
        interact(
          SELECTORS.promptTextarea,
          `value = (new TextDecoder().decode(new Uint8Array('${encoded}'.split(',').map((n) => parseInt(n))).buffer))`
        );
      },
      // interact(SELECTORS.promptTextarea, `value = atob(\`${btoa(text)}\`)`)},
      debouncedSetPromptText: debounce(async (text) => {
        webviewRef.current?.focus();
        await webviewRef.current?.executeJavaScript(
          `(()=>{const t = document.querySelector(${SELECTORS.promptTextarea}); t.value = "";t.focus();})();`
        );
        webviewRef.current?.insertText(text);
      }, 500),
      newChat: () => interact(SELECTORS.newChat),
      nextChat: () =>
        exec(
          `(document.querySelector(${SELECTORS.activeChat})?.parentNode?.nextSibling?.firstChild ?? document.querySelector(${SELECTORS.firstChat}))?.click()`
        ),
      prevChat: () =>
        exec(
          `(document.querySelector(${SELECTORS.activeChat})?.parentNode?.previousSibling?.firstChild ?? document.querySelector(${SELECTORS.firstChat}))?.click()`
        ),
      isGPT4: () => webviewRef.current.getURL().includes('gpt-4'),
      getTokenLimit: () =>
        appActions.isGPT4() ? GPT4_MAX_TOKENS : GPT3_5_MAX_TOKENS,
      updateTokenCount: async (prompt?: string) => {
        if (prompt === undefined) prompt = await appActions.getPromptText();
        const tokenCount = prompt.trim() ? getTokenCount(prompt) : 0;
        const tokenLimit = appActions.getTokenLimit();
        const tokenCountDesc =
          `Tokens: ${tokenCount} / ${tokenLimit}` +
          (tokenCount > tokenLimit ? ' ⚠️' : '');
        interact(
          SELECTORS.gptReleaseNotes,
          `replaceChildren('${tokenCountDesc}')`
        );
      },
      saveEditAndSubmit: () =>
        isEditorOpen || interact(SELECTORS.saveEditSubmitButton),
      submitPrompt: () =>
        isEditorOpen || interact(SELECTORS.submitPromptButton),
      submitAll: () =>
        isEditorOpen ||
        interactMany([
          SELECTORS.saveEditSubmitButton,
          SELECTORS.submitPromptButton,
        ]),
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
      // toggleColorMode: async () => {
      //   const mode = colorMode === 'dark' ? 'light' : 'dark';
      //   await exec(
      //     `localStorage.setItem('theme', '${mode}');document.documentElement.className = '${mode}';document.documentElement.style.setProperty('color-scheme', '${mode}');`
      //   );
      //   setColorMode(mode);
      // },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const toggleColorMode = async () => {
    const mode = colorMode === 'dark' ? 'light' : 'dark';
    await exec(
      `localStorage.setItem('theme', '${mode}');document.documentElement.className = '${mode}';document.documentElement.style.setProperty('color-scheme', '${mode}');`
    );
    setColorMode(mode);
  };

  const actions = {
    ...appActions,
    toggleColorMode,
  };

  useEffect(() => {
    if (webviewInitialized && !isEditorOpen) {
      appActions.focusPromptTextarea();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditorOpen, webviewInitialized]);

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
        const webViewColorMode = await appActions.getColorMode();
        setColorMode(webViewColorMode);
        await exec(
          contentScript
            .replace(`'KEYBOARD_SHORTCUTS'`, JSON.stringify(KEYBOARD_SHORTCUTS))
            .replace(`'IS_MACOS'`, `${utools.isMacOS()}`)
        );
        await webview.insertCSS(cleanupCSS + hljsTheme);
        // await webview.insertCSS(cleanupCSS);
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
        openContextMenu();
        setCtxParams({
          ...params,
          windowHeight: height,
          windowWidth: width,
        } as CtxParams);
      };
      // webview.addEventListener('did-navigate', onload);
      webview.addEventListener('context-menu', onContextMenu);
      webview.addEventListener('console-message', onMessage);
      webview.addEventListener('new-window', (e) => {
        console.log('🖥️ new-window', e);
        e.preventDefault();
        utools.shellOpenExternal(e.url);
      });
      // webview.addEventListener('load-commit', (e) => {
      //   console.log('🖥️ load-commit', e);
      // });
      webview.addEventListener('did-navigate-in-page', () => {
        // console.log('🖥️ did-navigate-in-page', e);
        onload();
      });
      webview.addEventListener('page-title-updated', (e) => {
        // console.log('🖥️ page-title-updated', e.title);
        window.API.updatePageTitle(e.title);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
            isOpen={isContextMenuOpen}
            onClose={closeContextMenu}
            actions={actions}
          />
          <ToolBar
            actions={actions}
            isPinned={isPinned}
            colorMode={colorMode}
            openSettings={openPreferences}
            openEditor={openEditor}
          >
            {/* <SearchBar webviewRef={webviewRef} /> */}
          </ToolBar>
          <SettingsModal
            isOpen={isPreferencesOpen}
            onClose={closePreferences}
            actions={actions}
          />
          <PromptEditor
            isOpen={isEditorOpen}
            // onOpen={openEditor}
            onClose={closeEditor}
            actions={actions}
          />
        </>
      )}
    </>
  );
}

export default App;

import { GPT3_5_MAX_TOKENS, GPT4_MAX_TOKENS, SELECTORS } from '@/constants';
import { useSettings } from '@/hooks/useSettings';
import { getTokenCount } from '@/utils/tokenCount';
import isHotkey from 'is-hotkey';
import debounce from 'lodash.debounce';

export interface Action {
  name: string;
  nameCN?: string;
  keys: readonly string[];
  description?: string;
  action?: (...args) => void;
}
export interface BuiltinWithCustomAction {
  name: string;
  nameCN?: string;
  keys:
    | readonly string[]
    | {
        builtIn: string;
        custom: string[];
      };
  description?: string;
  action?: (...args) => void;
}

export const builtInChatGPTActions = {
  openNewChat: {
    name: 'Open New Chat',
    nameCN: '新对话',
    keys: {
      builtIn: 'Mod+Shift+T',
      custom: ['Mod+N'],
    },
    description: 'Open a new chat',
  },
  focusChatInput: {
    name: 'Focus Chat Input',
    nameCN: '聚焦对话输入框',
    keys: {
      builtIn: 'Shift+Esc',
      custom: ['/'],
    },
    description: 'Focus the chat input',
  },
  copyLastCodeBlock: {
    name: 'Copy Last Code Block',
    nameCN: '复制最后一段代码',
    keys: ['Mod+Shift+;'],
    description: 'Copy the last code block',
  },
  copyLastResponse: {
    name: 'Copy Last Response',
    nameCN: '复制最后一段回复',
    keys: ['Mod+Shift+C'],
    description: 'Copy the last response',
  },
  setCustomInstructions: {
    name: 'Set Custom Instructions',
    nameCN: '设置自定义指令',
    keys: ['Mod+Shift+I'],
    description: 'Set custom instructions',
  },
  toggleSidebar: {
    name: 'Toggle Sidebar',
    nameCN: '开关侧边栏',
    keys: ['Mod+Shift+S'],
    description: 'Toggle the sidebar',
  },
  deleteChat: {
    name: 'Delete Chat',
    nameCN: '删除对话',
    keys: ['Mod+Shift+Backspace'],
    description: 'Delete the chat',
  },
  showAllShortcuts: {
    name: 'Show All Shortcuts',
    nameCN: '显示所有快捷键',
    keys: ['Mod+/'],
    description: 'Show all shortcuts',
  },
} satisfies Record<string, BuiltinWithCustomAction>;

export const builtInContentActions = {
  undo: {
    name: 'Undo',
    nameCN: '撤销',
    keys: ['Mod+Z'],
    description: 'Undo the last action',
  },
  redo: {
    name: 'Redo',
    nameCN: '重做',
    keys: ['Mod+Shift+Z', 'Mod+Y'],
    description: 'Redo the last action',
  },
  copy: {
    name: 'Copy',
    nameCN: '复制',
    keys: ['Mod+C'],
    description: 'Copy selected text',
  },
  paste: {
    name: 'Paste',
    nameCN: '粘贴',
    keys: ['Mod+V'],
    description: 'Paste copied text',
  },
  cut: {
    name: 'Cut',
    nameCN: '剪切',
    keys: ['Mod+X'],
    description: 'Cut selected text',
  },
  selectAll: {
    name: 'Select All',
    nameCN: '全选',
    keys: ['Mod+A'],
    description: 'Select all text',
  },
} satisfies Record<string, Action>;

const createContentUtils = (wv: Electron.WebviewTag & HTMLWebViewElement) => ({
  interact: (selector: string, command = 'click()') =>
    wv.executeJavaScript(
      `(()=>{const e = document.querySelector(${selector});if(e) return e.${command}})();`
    ),
  interactMany: (selectors: string[], command = 'click()') =>
    wv?.executeJavaScript(
      selectors
        .map(
          (selector) =>
            `(()=>document.querySelector(${selector})?.${command})();`
        )
        .join('')
    ),
  execute: (script: string) => wv.executeJavaScript(script),
});

export const createCustomActions = ({
  wv,
  appURL,
  togglePin,
  toggleWindowDevTools,
}: {
  wv: Electron.WebviewTag & HTMLWebViewElement;
  appURL: string;
  togglePin: () => void;
  toggleWindowDevTools: () => void;
}): Action[] => {
  const { interact, interactMany, execute } = createContentUtils(wv);

  const contentActions = [].map((action) => ({
    matchKey: isHotkey(action.keys),
    action: wv[action.name],
    ...action,
  }));

  const contentActionHandlers = (e: KeyboardEvent) => {
    for (const { action, matchKey } of contentActions) {
      if (matchKey(e)) {
        e.preventDefault();
        try {
          action();
        } catch (e) {
          console.error(`Failed to execute ${action.name}: ${e}`);
        }
        return;
      }
    }
  };

  const windowActions: Action[] = [
    {
      name: 'Zoom In',
      keys: ['Mod+='],
      command: 'zoomIn',
      description: 'Zoom in',
      action: () => wv.setZoomLevel(wv.getZoomLevel() + 1),
    },
    {
      name: 'Zoom Out',
      keys: ['Mod+-'],
      command: 'zoomOut',
      description: 'Zoom out',
      action: () => wv.setZoomLevel(wv.getZoomLevel() - 1),
    },
    {
      name: 'Reset Zoom',
      keys: ['Mod+0'],
      command: 'resetZoom',
      description: 'Reset zoom',
      action: () => wv.setZoomLevel(0),
    },
    {
      name: 'Toggle Pin',
      keys: ['Mod+Shift+P'],
      command: 'togglePin',
      description: 'Toggle pin to top',
      action: () => togglePin(),
    },
    {
      name: 'Toggle Dev Tools (Window)',
      keys: ['F12'],
      command: 'toggleWindowDevTools',
      description: 'Toggle the developer tools for the window',
      action: () => toggleWindowDevTools(),
    },
    {
      name: 'Toggle Dev Tools',
      keys: ['Mod+F12'],
      command: 'toggleDevTools',
      description: 'Toggle the developer tools for the ChatGPT webview',
      action: () =>
        wv.isDevToolsOpened() ? wv.closeDevTools() : wv.openDevTools(),
    },
    {
      name: 'Reload App',
      keys: ['Mod+Shift+R', 'F5'],
      command: 'reloadApp',
      description: 'Reload the app',
      action: () => wv.loadURL(appURL),
    },
  ];

  const appActions = {
    //* ChatGPT Actions */
    insertText: (text) => wv.insertText(text),
    focusPromptTextarea: () => {
      wv.focus();
      interact(SELECTORS.promptTextarea, 'focus()');
    },
    blurPromptTextarea: () => interact(SELECTORS.promptTextarea, 'blur()'),
    getPromptText: () =>
      execute(`document.querySelector(${SELECTORS.promptTextarea})?.value`),
    setPromptText: (text) => {
      const encoded = new TextEncoder().encode(text).join(',');
      interact(
        SELECTORS.promptTextarea,
        `value = (new TextDecoder().decode(new Uint8Array('${encoded}'.split(',').map((n) => parseInt(n))).buffer))`
      );
    },
    debouncedSetPromptText: debounce(async (text) => {
      wv.focus();
      await wv.executeJavaScript(
        `(()=>{const t = document.querySelector(${SELECTORS.promptTextarea}); t.value = "";t.focus();})();`
      );
      wv.insertText(text);
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
  };
  // saveEditAndSubmit: () =>
  //   editor.isOpen || interact(SELECTORS.saveEditSubmitButton),
  // submitPrompt: () => editor.isOpen || interact(SELECTORS.submitPromptButton),
  // submitAll: () =>
  //   editor.isOpen ||
  //   interactMany([
  //     SELECTORS.saveEditSubmitButton,
  //     SELECTORS.submitPromptButton,
  //   ]),

  const chatgptActions: Action[] = [];

  return [...contentActions, ...windowActions];
};

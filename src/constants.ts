export const CHAT_GPT_URL = 'https://chat.openai.com';
export const GPT4_MAX_TOKENS = 4000; // 4096 is the max
export const GPT3_5_MAX_TOKENS = 8000; // 8192 is the max

export const SELECTORS = {
  newChat: `'[aria-label="Chat history"] a'`,
  firstChat: `'[aria-label="Chat history"] ol a'`,
  activeChat: `'[aria-label="Chat history"] ol a.bg-gray-800'`,
  promptTextarea: `'#prompt-textarea'`,
  toggleSidebar: `'span[data-state="closed"] > a'`,
  toggleGPTModel: `'[class*="group/button"].border-transparent'`,
  gptReleaseNotes: `'form ~ div'`,
  saveEditSubmitButton: `'textarea ~ div > button[class="btn relative btn-primary mr-2"]'`,
  cancelEditButton: `'textarea ~ div > button[class="btn relative btn-neutral"]'`,
  submitPromptButton: `'#prompt-textarea ~ button'`,
};

export const KEYBOARD_SHORTCUTS = {
  'CmdOrCtrl + R': 'reload',
  'CmdOrCtrl + Shift + R': 'reloadIgnoringCache',
  'CmdOrCtrl + Shift + I': 'openDevTools',
  'CmdOrCtrl + I': 'toggleWindowDevTools',
  'CmdOrCtrl + Z': 'undo',
  'CmdOrCtrl + =': 'zoomIn',
  'CmdOrCtrl + -': 'zoomOut',
  'CmdOrCtrl + 0': 'zoomReset',
  'CmdOrCtrl + /': 'toggleSidebar',
  'CmdOrCtrl + .': 'focusPromptTextarea',
  'CmdOrCtrl + N': 'newChat',
  'CmdOrCtrl + [': 'prevChat',
  'CmdOrCtrl + Shift + Tab': 'prevChat',
  'CmdOrCtrl + ]': 'nextChat',
  'CmdOrCtrl + Tab': 'nextChat',
  'CmdOrCtrl + Enter': 'submitAll',
  'CmdOrCtrl + M': 'toggleGPTModel',
  'CmdOrCtrl + L': 'toggleColorMode',
  'CmdOrCtrl + T': 'togglePin',
  'CmdOrCtrl + P': 'togglePreferences',
  'CmdOrCtrl + E': 'openEditor',
  'Alt + Enter': 'openEditor',
  Esc: 'closeEditor',
};

export const PALETTE_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'blue',
  'purple',
  'pink',
];

export const CHATGPT_GRAY = {
  50: '#F7F7F8',
  100: '#EDEDF2',
  200: '#D9D9E3',
  300: '#C5C5D3',
  400: '#ACACBE',
  500: '#8D8DA0',
  600: '#555768',
  700: '#444654',
  800: '#343541',
  900: '#202122',
  950: '#05050A',
};

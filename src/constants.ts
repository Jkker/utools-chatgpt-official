export const CHAT_GPT_URL = 'https://chat.openai.com';
export const GPT4_MAX_TOKENS = 32767; // gpt-4
export const GPT3_5_MAX_TOKENS = 8191; // text-davinci-002-render-sha

export const SELECTORS = {
  currentModel: `'[role="presentation"] [aria-haspopup="menu"]'`,
  newChat: [
    `button[class="text-token-text-primary"]`, // pc
    `'[aria-haspopup="menu"] ~ div > button'`, // mobile
  ],
  firstChat: `'ol > li a'`,
  activeChat: `'a.bg-token-surface-primary'`,
  promptTextarea: `'#prompt-textarea'`,
  toggleSidebar: `'main div button'`,
  gptReleaseNotes: `'form ~ div'`,
  saveEditSubmitButton: `'textarea ~ div > button[class="btn relative btn-primary mr-2"]'`,
  cancelEditButton: `'textarea ~ div > button[class="btn relative btn-neutral"]'`,
  submitPromptButton: `'#prompt-textarea ~ button'`,
  regenerateButton: `'form > div > div:nth-child(2) > div > button'`,
  regenerateButton2: `'form > div > div:nth-child(1) > div > button'`,
};

export const KEYBOARD_SHORTCUTS = {
  'mod+R': 'reload',
  'mod+shift+R': 'reloadIgnoringCache',
  'mod+shift+I': 'openDevTools',
  'mod+I': 'toggleWindowDevTools',
  'mod+Z': 'undo',
  'mod+=': 'zoomIn',
  'mod+-': 'zoomOut',
  'mod+0': 'zoomReset',
  'mod+/': 'toggleSidebar',
  'mod+.': 'focusPromptTextarea',
  'mod+N': 'newChat',
  'mod+[': 'prevChat',
  'mod+shift+Tab': 'prevChat',
  'mod+]': 'nextChat',
  'mod+Tab': 'nextChat',
  'mod+Enter': 'submitAll',
  'mod+T': 'togglePin',
  'mod+P': 'togglePreferences',
  'mod+E': 'openEditor',
  'alt+Enter': 'openEditor',
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

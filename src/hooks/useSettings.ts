import debounce from 'lodash.debounce';
import { create } from 'zustand';

type Settings = {
  chatgptURL: string;
  language: 'zh' | 'en';
  keepAlive: boolean;
};

type SettingsStore = Settings & {
  setChatgptURL: (url: string) => void;
  setLanguage: (language: 'zh' | 'en') => void;
  setKeepAlive: (keepAlive: boolean) => void;
  set: (name: string, value: any) => void;
  debouncedSet: (name: string, value: any) => void;
  load: () => void;
  save: () => void;
};

const defaultPreferences: Settings = {
  chatgptURL: 'https://chat.openai.com',
  language: 'en',
  keepAlive: false,
};

export const useSettings = create<SettingsStore>()((set, get) => ({
  chatgptURL: 'https://chat.openai.com',
  setChatgptURL: (url) => set({ chatgptURL: url }),
  language: 'en',
  setLanguage: (language) => set({ language }),
  keepAlive: false,
  setKeepAlive: (keepAlive) => set({ keepAlive }),
  set: (name, value) => set({ [name]: value }),
  debouncedSet: debounce((name, value) => set({ [name]: value }), 500),
  save: () => {
    const { chatgptURL, language, keepAlive } = get();
    if (!('utools' in window)) return;

    utools.dbStorage.setItem('settings', {
      preferences: {
        chatgptURL,
        language,
        keepAlive,
      },
    });
  },
  load: () => {
    if (!('utools' in window)) return;

    const settings = utools.dbStorage.getItem('settings');
    const preferences = settings?.preferences ?? {};
    set({
      ...defaultPreferences,
      ...preferences,
    });
  },
}));

export const settingsFormData = [
  {
    label: 'ChatGPT URL',
    description: 'The URL of your ChatGPT instance',
    name: 'chatgptURL',
    type: 'text',
    placeholder: defaultPreferences.chatgptURL,
    required: true,
  },
  {
    label: 'Language',
    name: 'language',
    type: 'radio',
    options: [
      { label: 'English', value: 'en' },

      { label: '中文', value: 'zh' },
    ],
    required: true,
  },
  {
    label: 'Keep Alive',
    description: 'Keep the app alive when the window is closed',
    name: 'keepAlive',
    type: 'checkbox',
    required: true,
  },
];

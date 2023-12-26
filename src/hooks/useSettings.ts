import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { EN, ZH } from '../assets/i18n';

type Settings = {
  chatgptURL: string;
  language: 'zh' | 'en';
  ignoreInternetWarning: boolean;
};

type SettingsStore = Settings & {
  setChatgptURL: (url: string) => void;
  setLanguage: (language: 'zh' | 'en') => void;
  set: (name: string, value: any) => void;
  debouncedSet: (name: string, value: any) => void;
  load: () => void;
  save: () => void;
  T: typeof EN;
};

const defaultPreferences: Settings = {
  chatgptURL: 'https://chat.openai.com',
  language: 'zh',
  ignoreInternetWarning: false,
};

export const utoolsStorage: StateStorage = {
  getItem: (name: string) => {
    const data = utools.dbStorage.getItem(name);
    return data ? JSON.parse(data) : null;
  },
  setItem: debounce((name: string, value: any) => {
    utools.dbStorage.setItem(name, JSON.stringify(value));
  }, 250),

  removeItem: (name: string) => {
    utools.dbStorage.removeItem(name);
  },
};

const settingsStorage = {
  name: 'settings',
  storage: createJSONStorage(() => utoolsStorage),
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultPreferences,
      setChatgptURL: (url) => set({ chatgptURL: url }),
      setLanguage: (language) =>
        set({ language, T: language === 'zh' ? ZH : EN }),
      set: (name, value) => set({ [name]: value }),
      debouncedSet: debounce((name, value) => set({ [name]: value }), 500),
      save: () => {
        const { chatgptURL, language } = get();
        if (!('utools' in window)) return;

        utools.dbStorage.setItem('settings', {
          preferences: {
            chatgptURL,
            language,
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
          T: preferences.language === 'zh' ? ZH : EN,
        });
      },
      T: ZH,
    }),
    settingsStorage
  )
);

export const settingsFormData = [
  {
    label: 'ChatGPT URL',
    description: 'The URL of your ChatGPT instance',
    name: 'chatgptURL',
    type: 'text',
    placeholder: defaultPreferences.chatgptURL,
    required: true,
  },
  /*  {
    label: 'Language',
    name: 'language',
    type: 'radio',
    options: [
      { label: 'English', value: 'en' },

      { label: '中文', value: 'zh' },
    ],
    required: true,
  }, */
  /* {
    label: 'Keep Alive',
    description: 'Keep the app alive when the window is closed',
    name: 'keepAlive',
    type: 'checkbox',
    required: true,
  }, */
];

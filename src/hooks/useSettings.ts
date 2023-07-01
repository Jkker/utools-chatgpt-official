import type { ColorMode, ColorModeWithSystem } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { EN, ZH } from '../assets/i18n';

export const resolveColorMode = (colorMode: ColorModeWithSystem) => {
  if (colorMode === 'system') {
    return utools.isDarkColors() ? 'dark' : 'light';
  }
  return colorMode;
};

export const resolveLanguage = (language: 'zh' | 'en'): typeof EN =>
  language === 'zh' ? ZH : EN;

type Settings = {
  chatgptURL: string;
  language: 'zh' | 'en';
  keepAlive: boolean;
  colorMode: ColorModeWithSystem;
  resolvedColorMode: ColorMode;
};

type SettingsStore = Settings & {
  setChatgptURL: (url: string) => void;
  setLanguage: (language: 'zh' | 'en') => void;
  setKeepAlive: (keepAlive: boolean) => void;
  setColorMode: (colorMode: ColorModeWithSystem) => void;
  toggleColorMode: () => void;
  set: (name: string, value: any) => void;
  debouncedSet: (name: string, value: any) => void;
  load: () => void;
  save: () => void;
  reset: () => void;
  T: typeof EN;
};

const DEFAULT_SETTINGS: Settings = {
  chatgptURL: 'https://chat.openai.com',
  language: 'zh',
  keepAlive: false,
  colorMode: 'system',
  resolvedColorMode: resolveColorMode('system'),
};

const loadSettings = () => {
  if (!('utools' in window)) return { ...DEFAULT_SETTINGS, T: ZH };
  const loadedSettings = utools.dbStorage.getItem('settings');
  const mergedSettings = {
    ...DEFAULT_SETTINGS,
  };
  if (loadedSettings) {
    for (const key in loadedSettings) {
      if (mergedSettings[key] !== undefined) {
        mergedSettings[key] = loadedSettings[key];
      }
    }
  }

  console.log('⚙️ Load', mergedSettings);
  return {
    ...mergedSettings,
    T: resolveLanguage(mergedSettings.language),
  };
};

export const useSettings = create<SettingsStore>()((set, get) => ({
  ...loadSettings(),
  setChatgptURL: (url) => set({ chatgptURL: url }),
  setLanguage: (language) => set({ language, T: resolveLanguage(language) }),
  setKeepAlive: (keepAlive) => set({ keepAlive }),
  setColorMode: (colorMode) =>
    set({
      colorMode,
      resolvedColorMode: resolveColorMode(colorMode),
    }),
  toggleColorMode: () => {
    const { resolvedColorMode } = get();
    const colorMode = resolvedColorMode === 'dark' ? 'light' : 'dark';
    return set({
      colorMode,
      resolvedColorMode: colorMode,
    });
  },
  set: (name, value) => set({ [name]: value }),
  debouncedSet: debounce((name, value) => set({ [name]: value }), 500),
  save: () => {
    if (!('utools' in window)) return;
    const currentSettings = get();
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
    };
    for (const key in currentSettings) {
      if (key in mergedSettings && currentSettings[key] !== undefined) {
        mergedSettings[key] = currentSettings[key];
      }
    }
    console.log('⚙️ Save', mergedSettings);
    utools.dbStorage.setItem('settings', mergedSettings);
  },
  load: () => set(loadSettings()),
  reset: () => {
    set({
      ...DEFAULT_SETTINGS,
      T: ZH,
    });
    utools.dbStorage.removeItem('settings');
  },
}));

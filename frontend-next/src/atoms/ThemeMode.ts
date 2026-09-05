import { atom } from 'recoil';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'themeMode';

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const themeModeState = atom<ThemeMode>({
  key: 'themeMode',
  default: 'light',
  effects: [
    ({ setSelf, onSet }) => {
      setSelf(getInitialThemeMode());
      onSet((newValue) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, newValue);
        }
      });
    }
  ]
});

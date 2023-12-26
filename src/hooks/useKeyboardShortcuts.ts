/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import isHotkey from 'is-hotkey';

const useKeyboardShortcuts = (shortcuts: [key: string, cb: () => void][]) => {
  const keyboardShortcuts = useMemo(
    () =>
      shortcuts.map(([key, cb]) => ({
        fn: isHotkey(key),
        cb,
      })),
    [shortcuts]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) =>
      keyboardShortcuts.forEach(({ fn, cb }) => {
        if (fn(event)) {
          cb();
          console.log('💻 keyboard shortcut', event);
        }
      });

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export default useKeyboardShortcuts;

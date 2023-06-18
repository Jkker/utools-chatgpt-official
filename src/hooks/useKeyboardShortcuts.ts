/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';

const decomposeShortcut = (key: string, CmdOrCtrl: string) => {
  const [keyName, ...modifiers] = key.split('+').reverse();
  const normalizedModifiers = modifiers.map(
    (modifier) =>
      modifier.replace('CmdOrCtrl', CmdOrCtrl).toLowerCase().trim() + 'Key'
  );
  return {
    keyString: key,
    key: keyName.toLowerCase().trim(),
    modifiers: normalizedModifiers,
  };
};

const useKeyboardShortcuts = (shortcuts: [key: string, cb: () => void][]) => {
  const CmdOrCtrl =
    'utools' in window ? (utools.isMacOS() ? 'Meta' : 'Ctrl') : 'Ctrl';
  const decomposedShortcuts = useMemo(
    () =>
      shortcuts.map(([key, callback]) => ({
        ...decomposeShortcut(key, CmdOrCtrl),
        callback,
      })),
    []
  );
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = decomposedShortcuts.find(
        (shortcut) =>
          shortcut.key === event.key.toLowerCase() &&
          shortcut.modifiers.every((modifier) => event[modifier])
      );

      if (shortcut) {
        console.log('⌨️', shortcut.keyString);
        shortcut.callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export default useKeyboardShortcuts;

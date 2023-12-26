const CmdOrCtrl =
  'utools' in window ? (utools.isMacOS() ? '⌘' : 'Ctrl') : 'Ctrl';

export const toNativeShortcut = (shortcut: string) =>
  shortcut.replace(/mod/i, CmdOrCtrl);

// import { KEYBOARD_SHORTCUTS } from "@/constants";

// export const nativeKeyboardShortcuts = Object.fromEntries(
//   Object.entries(KEYBOARD_SHORTCUTS).map(([key, value]) => [
//     value,
//     toNativeShortcut(key),
//   ])
// );
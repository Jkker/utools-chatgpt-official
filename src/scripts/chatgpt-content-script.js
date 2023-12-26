(() => {
  const init = () => {
    const isMacOS = 'IS_MACOS';
    const $ = (selector) => document.querySelector(selector);

    if (document.documentElement.dataset.initialized) return;
    document.documentElement.dataset.initialized = true;

    const sendCommand = (cmd, payload = '') =>
      console.info('!_COMMAND_' + cmd + '#^#' + payload);

    const debounce = (fn, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          fn(...args);
        }, delay);
      };
    };


    sendCommand('updateTokenCount', '');
    const addTokenCountListener = () => {
      const t = document.getElementById('prompt-textarea');
      if (!t) return;
      if (t.dataset.tokenCountListener) return;
      console.log('🚀 addTokenCountListener');
      t.dataset.tokenCountListener = true;

      $('form ~ div')?.replaceChildren('Tokens: 0 / ?');

      const update = debounce(
        (e) => sendCommand('updateTokenCount', e.target.value),
        250
      );

      t.addEventListener('input', update);
      t.addEventListener('change', update);
    };

    new MutationObserver(addTokenCountListener).observe(
      document.documentElement,
      {
        childList: true,
        subtree: true,
      }
    );

    // $('div[class="h-32 md:h-48 flex-shrink-0"]').addEventListener(
    //   'dblclick',
    //   () => sendCommand('')
    // );

    const decomposeShortcut = (key) => {
      const CmdOrCtrl = isMacOS ? 'Meta' : 'Ctrl';
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
    const registerKeyboardShortcuts = (shortcuts) => {
      const decomposedShortcuts = Object.entries(shortcuts).map(
        ([key, callbackName]) => ({
          ...decomposeShortcut(key),
          callbackName,
        })
      );
      const handleKeyDown = (event) => {
        const key = event.key.toLowerCase();
        if (key === 'escape') {
          event.preventDefault();
          document.activeElement.blur();
          return;
        }
        const shortcut = decomposedShortcuts.find(
          (shortcut) =>
            shortcut.key === key.toLowerCase() &&
            shortcut.modifiers.every((modifier) => event[modifier])
        );
        if (shortcut) {
          sendCommand(shortcut.callbackName);
          event.preventDefault();
          return;
        }
        // check if currently focused element is editable and update token count
        if (event.target.matches('input, textarea, [contenteditable]')) return;
        // ignore if any modifier key is pressed
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        // focus textarea on alphanumeric keypress
        if (key.match(/^[a-z0-9/\\]$/i)) {
          $('#prompt-textarea')?.focus();
          return;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
    };

    registerKeyboardShortcuts('KEYBOARD_SHORTCUTS');
  };
  init();
})();

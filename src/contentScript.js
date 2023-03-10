(() => {
  const getTextarea = () => document.querySelector('textarea[data-id="root"]');
  const ICON = {
    copy: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>`,
    paste: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 11V5c0-1.103-.897-2-2-2h-3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H4c-1.103 0-2 .897-2 2v13c0 1.103.897 2 2 2h7c0 1.103.897 2 2 2h7c1.103 0 2-.897 2-2v-7c0-1.103-.897-2-2-2zm-9 2v5H4V5h3v2h8V5h3v6h-5c-1.103 0-2 .897-2 2zm2 7v-7h7l.001 7H13z"></path></svg>`,
    cut: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 4.57 8.43 3 6.5 3S3 4.57 3 6.5 4.57 10 6.5 10a3.45 3.45 0 0 0 1.613-.413l2.357 2.528-2.318 2.318A3.46 3.46 0 0 0 6.5 14C4.57 14 3 15.57 3 17.5S4.57 21 6.5 21s3.5-1.57 3.5-3.5c0-.601-.166-1.158-.434-1.652l2.269-2.268L17 19.121a3 3 0 0 0 2.121.879H22L9.35 8.518c.406-.572.65-1.265.65-2.018zM6.5 8C5.673 8 5 7.327 5 6.5S5.673 5 6.5 5 8 5.673 8 6.5 7.327 8 6.5 8zm0 11c-.827 0-1.5-.673-1.5-1.5S5.673 16 6.5 16s1.5.673 1.5 1.5S7.327 19 6.5 19z"></path><path d="m17 4.879-3.707 4.414 1.414 1.414L22 4h-2.879A3 3 0 0 0 17 4.879z"></path></svg>`,
    refresh: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path></svg>`,
  };
  const insertCSS = (css) => {
    const style = document.createElement('style');
    style.innerHTML = css.trim();
    document.head.appendChild(style);
  };
  const createContextMenu = () => {
    const contextMenu = document.createElement('div');
    const item = (label, action, icon) => {
      const button = document.createElement('button');
      button.innerHTML = icon + label;
      button.addEventListener('click', () => {
        action();
        contextMenu.classList.remove('show');
      });
      return button;
    };

    insertCSS(`.context-menu {
    display: none;
    position: fixed;
    z-index: 100;
    background-color: #fff;
    border-radius: 0.375rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    font-size: 14px;
  }

  .context-menu.show {
    display: block;
  }

  .context-menu button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 10px;
    text-align: left;
    color: #333;
    font-size: 14px;
    line-height: normal;
    transition: all 0.15s ease-in-out;
    border-radius: 0.375rem;
  }

  .context-menu button:hover {
    background-color: #e1e1e1;
  }
  .context-menu button:active {
    background-color: #d1d1d1;
  }

  @media (prefers-color-scheme: dark) {
    .context-menu {
      background-color: #202123;
      color: #fff;
    }

    .context-menu button {
      color: #fff;
    }

    .context-menu button:hover {
      background-color: #343541;
    }
  }`);

    const show = (event) => {
      contextMenu.innerHTML = '';
      const selection = window.getSelection().toString();

      if (selection) {
        contextMenu.appendChild(
          item(
            'Copy',
            () => navigator.clipboard.writeText(selection.trim()),
            ICON.copy
          )
        );
      }
      if (event.target.tagName === 'TEXTAREA') {
        if (selection)
          contextMenu.appendChild(
            item(
              'Cut',
              () => {
                navigator.clipboard.writeText(selection.trim());
                event.target.setRangeText(
                  '',
                  event.target.selectionStart,
                  event.target.selectionEnd,
                  'end'
                );
              },
              ICON.cut
            )
          );

        contextMenu.appendChild(
          item(
            'Paste',
            () =>
              navigator.clipboard.readText().then((text) => {
                const selectionStart = event.target.selectionStart;
                const selectionEnd = event.target.selectionEnd;
                event.target.setRangeText(
                  text,
                  selectionStart,
                  selectionEnd,
                  'end'
                );
              }),
            ICON.paste
          )
        );
      }

      contextMenu.appendChild(
        item('Refresh', () => window.location.reload(), ICON.refresh)
      );

      contextMenu.classList.add('show');

      if (event.pageX + contextMenu.offsetWidth > window.innerWidth - 10) {
        contextMenu.style.left = `${
          window.innerWidth - contextMenu.offsetWidth - 10
        }px`;
      } else {
        contextMenu.style.left = `${event.pageX}px`;
      }

      if (event.pageY + contextMenu.offsetHeight > window.innerHeight - 10) {
        contextMenu.style.top = `${
          window.innerHeight - contextMenu.offsetHeight - 10
        }px`;
      } else {
        contextMenu.style.top = `${event.pageY}px`;
      }
    };

    document.addEventListener('click', () => {
      contextMenu.classList.remove('show');
    });

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      show(event);
    });
    contextMenu.classList.add('context-menu');

    document.body.appendChild(contextMenu);
  };

  const init = () => {
    console.log('focused', document.hasFocus(), document.activeElement.tagName);
    if (window.pluginInitialized) return;

    console.log('contentScript.js');

    const textarea = getTextarea();
    textarea.focus();

    console.log('focused', document.hasFocus(), document.activeElement.tagName);

    window.writeInput = (text) => {
      const textarea = getTextarea();
      textarea.value = decodeURIComponent(text);
      textarea.focus();

      return true;
    };

    document.querySelector('form div').addEventListener('click', function () {
      getTextarea().focus();
    });
    // custom styles
    insertCSS(`
body code, body pre {
  font-family: 'JetBrains Mono', Consolas, monospace !important;
}

/* Highlight Textarea */
form > div div:last-child:focus-within {
  transition: box-shadow 0.15s ease-in-out;
}
form > div div:last-child:focus-within {
  box-shadow: 0 0 0 2px #3b82f6 !important;
}

/* Remove Updates & FAQ */
a[href="https://help.openai.com/en/collections/3742473-chatgpt"] {
  display: none;
}
  `);

    window.pluginInitialized = true;

    document.addEventListener('keydown', (event) => {
      const textarea = getTextarea();
      if (!textarea) return;
      const blurred = !textarea.matches(':focus');
      if (event.key === 'Escape' && !blurred) {
        event.preventDefault();
        textarea.blur();
      }
      if (event.key.match(/^[a-z0-9]+$/i) && blurred) {
        textarea.focus();
        // add key to textarea
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        // textarea.setRangeText(event.key, selectionStart, selectionEnd, 'end');
        return;
      }
      if (event.key === 'Enter' && blurred) {
        textarea.focus();
      }
    });
  };
  let observer;

  createContextMenu();

  if (getTextarea()) {
    init();
  } else {
    observer = new MutationObserver(() => {
      if (window.pluginInitialized) {
        observer?.disconnect();
      } else if (getTextarea()) {
        init();
        observer?.disconnect();
      }
    }).observe(document.querySelector('div[id="__next"]') ?? document, {
      childList: true,
    });
  }
})();

(() => {
  // SECTION: Constants
  const CHATGPT_URL = 'https://chat.openai.com';

  const ICON = {
    copy: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>`,
    paste: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 11V5c0-1.103-.897-2-2-2h-3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H4c-1.103 0-2 .897-2 2v13c0 1.103.897 2 2 2h7c0 1.103.897 2 2 2h7c1.103 0 2-.897 2-2v-7c0-1.103-.897-2-2-2zm-9 2v5H4V5h3v2h8V5h3v6h-5c-1.103 0-2 .897-2 2zm2 7v-7h7l.001 7H13z"></path></svg>`,
    cut: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 4.57 8.43 3 6.5 3S3 4.57 3 6.5 4.57 10 6.5 10a3.45 3.45 0 0 0 1.613-.413l2.357 2.528-2.318 2.318A3.46 3.46 0 0 0 6.5 14C4.57 14 3 15.57 3 17.5S4.57 21 6.5 21s3.5-1.57 3.5-3.5c0-.601-.166-1.158-.434-1.652l2.269-2.268L17 19.121a3 3 0 0 0 2.121.879H22L9.35 8.518c.406-.572.65-1.265.65-2.018zM6.5 8C5.673 8 5 7.327 5 6.5S5.673 5 6.5 5 8 5.673 8 6.5 7.327 8 6.5 8zm0 11c-.827 0-1.5-.673-1.5-1.5S5.673 16 6.5 16s1.5.673 1.5 1.5S7.327 19 6.5 19z"></path><path d="m17 4.879-3.707 4.414 1.414 1.414L22 4h-2.879A3 3 0 0 0 17 4.879z"></path></svg>`,
    // TbRefresh
    refresh: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><desc></desc><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path></svg>`,
    // BiExpand
    expand:
      '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m21 15.344-2.121 2.121-3.172-3.172-1.414 1.414 3.172 3.172L15.344 21H21zM3 8.656l2.121-2.121 3.172 3.172 1.414-1.414-3.172-3.172L8.656 3H3zM21 3h-5.656l2.121 2.121-3.172 3.172 1.414 1.414 3.172-3.172L21 8.656zM3 21h5.656l-2.121-2.121 3.172-3.172-1.414-1.414-3.172 3.172L3 15.344z"></path></svg>',
    // BiCollapse
    collapse:
      '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16.121 6.465 14 4.344V10h5.656l-2.121-2.121 3.172-3.172-1.414-1.414zM4.707 3.293 3.293 4.707l3.172 3.172L4.344 10H10V4.344L7.879 6.465zM19.656 14H14v5.656l2.121-2.121 3.172 3.172 1.414-1.414-3.172-3.172zM6.465 16.121l-3.172 3.172 1.414 1.414 3.172-3.172L10 19.656V14H4.344z"></path></svg>',
    // BsPinAngle
    pin: '<svg class="BsPinAngle" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"></path></svg>',
    // BsPinAngleFill
    unpin:
      '<svg class="BsPinAngleFill" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"></path></svg>',
    markdown:
      '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"></path><path fill-rule="evenodd" d="M9.146 8.146a.5.5 0 0 1 .708 0L11.5 9.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708z"></path><path fill-rule="evenodd" d="M11.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z"></path><path d="M3.56 11V7.01h.056l1.428 3.239h.774l1.42-3.24h.056V11h1.073V5.001h-1.2l-1.71 3.894h-.039l-1.71-3.894H2.5V11h1.06z"></path></svg>',
    // TbSum
    sum: '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><desc></desc><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 16v2a1 1 0 0 1 -1 1h-11l6 -7l-6 -7h11a1 1 0 0 1 1 1v2"></path></svg>',
  };

  const TEXT = {
    refresh: '刷新 (Ctrl + R)',
    unpin: '取消置顶 (Ctrl + T)',
    pin: '置顶 (Ctrl + T)',
    collapse: '折叠 (Ctrl + E)',
    expand: '展开 (Ctrl + E)',
    cut: '剪切 (Ctrl + X)',
    copy: '复制 (Ctrl + C)',
    paste: '粘贴 (Ctrl + V)',
    saveChatAsMarkdown: '导出为 Markdown (Ctrl + S)',
    copyChatAsMarkdown: '复制为 Markdown',
    characterCount: '字符数：',
  };

  // END_SECTION
  const sendCommand = (str) => console.info('!_COMMAND_' + str);

  // SECTION: Helper functions
  const getTextarea = () => document.querySelector('textarea');

  const insertCSS = (css, el = document.head) => {
    const style = document.createElement('style');
    style.innerHTML = css.trim();
    el.appendChild(style);
  };

  const findElementByClassName = (elem, cls, checkParent = true) => {
    // check elem
    if (
      elem.classList &&
      (elem.className === cls || elem.classList.contains(cls))
    )
      return elem;

    // check children
    const children = elem.querySelectorAll(`[class~="${cls}"]`);
    if (children.length === 1) return children[0];

    // check parents
    if (!checkParent) return null;

    while (elem.parentNode) {
      elem = elem.parentNode;
      if (
        elem.classList &&
        (elem.className === cls || elem.classList.contains(cls))
      ) {
        return elem;
      }
    }
    return null;
  };

  const refresh = () => {
    if (window.location.href.startsWith(CHATGPT_URL)) window.location.reload();
    else window.location.href = CHATGPT_URL;
  };
  // END_SECTION

  const createMarkdownConverter = () => {
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    turndownService.use(turndownPluginGfm.gfm);
    const htmlProseToMarkdown = (prose) =>
      Array.from(prose.children, (e) =>
        // Convert code block
        e.tagName.toLowerCase() === 'pre'
          ? // Detect language
            `\`\`\`${
              e.querySelector('code').className.match(/language-(.*)/)[1] ?? ''
            }\n${e.querySelector('code').textContent.trim()}\n\`\`\``
          : // Convert others to markdown
            turndownService.turndown(e.outerHTML)
      ).join('\n\n');
    const chat2markdown = () => {
      const chat = document.querySelectorAll('.text-base');
      let md = '';
      for (const e of chat) {
        const prose = e.querySelector('.prose');
        const img = e.querySelectorAll('img');
        md += md == '' ? '' : '\n\n---\n\n';
        if (prose) {
          md += `**ChatGPT**:\n\n`;
          md += htmlProseToMarkdown(prose);
        } else if (img.length > 0) {
          md += `**${img[1]?.alt || 'User'}**:\n\n`;
          md += e.childNodes[1].textContent.trim();
        }
      }
      return md;
    };

    const saveChatAsMarkdown = () => {
      const md = chat2markdown();
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const currTab = document.querySelector(
        'nav > div > div a[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group"]'
      );
      a.download = (currTab?.innerText || 'Conversation with ChatGPT') + '.md';
      a.click();
      URL.revokeObjectURL(url);
    };

    const copyChatAsMarkdown = () => {
      const md = chat2markdown();
      navigator.clipboard.writeText(md);
    };

    return {
      saveChatAsMarkdown,
      copyChatAsMarkdown,
      htmlProseToMarkdown,
    };
  };

  let pinned = false;
  const togglePin = () => {
    const pinButton = document.getElementById('pin-button');
    pinButton.classList.toggle('pinned');
    sendCommand(pinned ? 'UNPIN' : 'PIN');
    pinned = !pinned;
    pinButton.title = pinned ? TEXT.unpin : TEXT.pin;
  };

  const { saveChatAsMarkdown, copyChatAsMarkdown, htmlProseToMarkdown } =
    createMarkdownConverter();

  const createContextMenu = () => {
    const contextMenu = document.createElement('div');
    contextMenu.id = 'UTC-context-menu';
    const item = (label, action, icon) => {
      const button = document.createElement('button');
      button.innerHTML = icon + label;
      button.addEventListener('click', () => {
        action();
        contextMenu.classList.remove('show');
      });
      return button;
    };

    insertCSS(`#UTC-context-menu {
    display: none;
    position: fixed;
    z-index: 100;
    background-color: #fff;
    border-radius: 0.375rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    font-size: 14px;
  }

  #UTC-context-menu.show {
    display: block;
  }

  #UTC-context-menu button {
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

  #UTC-context-menu button:hover {
    background-color: #e1e1e1;
  }
  #UTC-context-menu button:active {
    background-color: #d1d1d1;
  }

  .dark #UTC-context-menu {
      background-color: #202123;
      color: #fff;
    }

  .dark #UTC-context-menu button {
    color: #fff;
  }

  .dark #UTC-context-menu button:hover {
    background-color: #343541;
  }
  `);

    const show = (event) => {
      contextMenu.innerHTML = '';
      const selection = window.getSelection().toString();
      const prose = findElementByClassName(event.target, 'prose');

      if (selection) {
        contextMenu.appendChild(
          item(
            TEXT.copy,
            () => navigator.clipboard.writeText(selection.trim()),
            ICON.copy
          )
        );
      } else if (
        findElementByClassName(
          event.target,
          'min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap',
          false
        )
      ) {
        // user message
        contextMenu.appendChild(
          item(
            TEXT.copy,
            () => navigator.clipboard.writeText(event.target.innerText.trim()),
            ICON.copy
          )
        );
      } else if (prose) {
        // chatgpt message
        contextMenu.appendChild(
          item(
            TEXT.copy,
            () => navigator.clipboard.writeText(htmlProseToMarkdown(prose)),
            ICON.copy
          )
        );
      }
      if (event.target.tagName === 'TEXTAREA') {
        if (selection)
          contextMenu.appendChild(
            item(
              TEXT.cut,
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
            TEXT.paste,
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

      // contextMenu.appendChild(item(TEXT.refresh, refresh, ICON.refresh));

      // Character count
      if (selection) {
        contextMenu.appendChild(
          item(
            `<div style="display: flex; flex: 1 1 auto; justify-content: space-between; align-items: center;"><span>${TEXT.characterCount}</span><span>${selection.length}</span></div>`,
            () => navigator.clipboard.writeText(selection.length),
            ICON.sum
          )
        );
      }

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

    document.body.appendChild(contextMenu);
  };

  const createTextareaResizeButton = () => {
    const textarea = getTextarea();
    // return if x-resize is already initialized
    if (textarea.dataset.resize === 'initialized') return;
    textarea.dataset.resize = 'initialized';
    const container = document.querySelector('form > div > div:last-child');
    container.querySelector('button > svg').style.marginRight = 0;
    const button = document.createElement('div');
    button.className =
      'absolute p-1 rounded-md text-gray-500 top-1.5 md:top-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40 cursor-pointer';
    button.innerHTML = ICON.expand + ICON.collapse;
    button.title = TEXT.expand;

    const expandIcon = button.querySelector('svg:first-child');
    const collapseIcon = button.querySelector('svg:last-child');
    collapseIcon.style.display = 'none';

    const expand = () => {
      button.title = TEXT.collapse;
      expandIcon.style.display = 'none';
      collapseIcon.style.display = 'block';
      textarea.style.height = 'auto';
      textarea.style.removeProperty('max-height');
      textarea.style.removeProperty('height');
      container.style.height = '85vh';
    };

    const collapse = () => {
      button.title = TEXT.expand;
      expandIcon.style.display = 'block';
      collapseIcon.style.display = 'none';
      textarea.style.removeProperty('max-height');
      textarea.style.removeProperty('height');
      container.style.height = '50px';
    };

    const toggle = () => {
      if (button.title === TEXT.collapse) {
        collapse();
      } else {
        expand();
      }
    };

    button.addEventListener('click', toggle);
    container.appendChild(button);
    container.style.transition = 'height 0.15s ease-in-out';
    container.style.minHeight = '74px';

    // focus textarea on click
    container.addEventListener('click', () => getTextarea().focus());
    window.toggleTextarea = toggle;
  };

  const createToolbar = (items) => {
    const toolbar = document.createElement('nav');
    toolbar.id = 'UTC-toolbar';
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.id = item.id;
      btn.className = 'button';
      btn.innerHTML = item.icon;
      btn.title = item.title;
      btn.addEventListener('click', item.action);
      toolbar.appendChild(btn);
    });
    document.body.position = 'relative';
    document.body.appendChild(toolbar);
  };

  const keydownHandler = (event) => {
    const { key, ctrlKey, shiftKey } = event;
    const textarea = getTextarea();

    if (!textarea) return;
    const blurred = !textarea.matches(':focus');

    if (key === 'F5') {
      refresh();
      return;
    }

    // keyboard shortcuts
    if (ctrlKey) {
      const tabList = document.querySelector('nav > div > div');
      const currTab = tabList.querySelector(
        'a[class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group"]'
      );
      switch (key.toLowerCase()) {
        // New chat
        case 'n': {
          event.preventDefault();
          document.querySelector('nav a').click();
          return;
        }
        // focus textarea
        case '/': {
          event.preventDefault();
          textarea.focus();
          return;
        }
        // refresh
        case 'r': {
          event.preventDefault();
          refresh();
          return;
        }

        // pin to top
        case 't': {
          event.preventDefault();
          togglePin();
          return;
        }

        // save chat
        case 's': {
          event.preventDefault();
          saveChatAsMarkdown();
          return;
        }

        // copy chat
        case 'm': {
          if (shiftKey) {
            event.preventDefault();
            copyChatAsMarkdown();
          }
          return;
        }

        // zoom in/out/reset
        case '-': {
          event.preventDefault();
          sendCommand('ZOOM_OUT');
          return;
        }
        case '=': {
          event.preventDefault();
          sendCommand('ZOOM_IN');
          return;
        }
        case '0': {
          event.preventDefault();
          sendCommand('ZOOM_RESET');
          return;
        }

        // switch chat tabs
        case 'tab': {
          event.preventDefault();

          const tabs = tabList.querySelectorAll('a');

          if (tabs.length === 1) {
            tabs[0].click();
            return;
          }
          if (tabs.length < 1) return;

          // Ctrl + Shift + Tab -> Previous Tab
          if (shiftKey) {
            const prevTab =
              currTab?.previousElementSibling ?? tabs[tabs.length - 1];
            prevTab.click();
          }
          // Ctrl + Tab -> Next Tab
          else {
            const nextTab = currTab?.nextElementSibling ?? tabs[0];
            nextTab.click();
          }
          return;
        }

        case 'e': {
          event.preventDefault();
          window.toggleTextarea();
        }

        default:
          break;
      }
    }

    // focus textarea on keypress if blurred
    else if (blurred) {
      if (key.match(/^[a-z0-9]$/i)) {
        textarea.focus();
      } else if (key === 'Enter') {
        event.preventDefault();
        textarea.focus();
      }
    } else {
      // blur textarea on escape
      if (key === 'Escape') {
        event.preventDefault();
        textarea.blur();
      }
    }
  };

  // SECTION: Initialize
  const init = () => {
    if (window.pluginInitialized) return;
    window.pluginInitialized = true;
    const textarea = getTextarea();

    // Load features
    createContextMenu();
    createTextareaResizeButton();
    // on dom change
    new MutationObserver(() => {
      console.log('dom changed');
      createTextareaResizeButton();
    }).observe(document, { childList: true, subtree: true });

    createToolbar([
      {
        id: 'copy-chat-as-markdown',
        title: TEXT.copyChatAsMarkdown,
        icon: ICON.copy,
        action: copyChatAsMarkdown,
      },
      {
        id: 'save-chat-as-markdown',
        title: TEXT.saveChatAsMarkdown,
        icon: ICON.markdown,
        action: saveChatAsMarkdown,
      },
      {
        id: 'refresh',
        title: TEXT.refresh,
        icon: ICON.refresh,
        action: refresh,
      },
      {
        id: 'pin-button',
        title: TEXT.pin,
        icon: ICON.pin + ICON.unpin,
        action: togglePin,
      },
    ]);

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
[class="rounded-md bg-yellow-200 py-0.5 px-1.5 text-xs font-medium uppercase text-gray-800"] {
  display: none;
}

/* Toolbar */
#UTC-toolbar .button {
  outline: none;
  height: 26px;
  width: 26px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  color: rgb(86, 88, 105);
  background-color: rgb(247, 247, 248);
  border-width: 1px;
  border-style: solid;
  border-color: rgba(217, 217, 227);
}
#UTC-toolbar .button:hover {
  filter: brightness(0.9);
}
#UTC-toolbar .button:active {
  filter: brightness(0.8);
}
.dark #UTC-toolbar .button {
  color: rgb(217, 217, 227);
  background-color: hsla(0, 0%, 100%, 0.1);
  border-color: hsla(0, 0%, 100%, 0.1);
}
.dark #UTC-toolbar .button:hover {
  filter: brightness(1.1);
}
.dark #UTC-toolbar .button:active {
  filter: brightness(1.2);
}

#UTC-toolbar #pin-button.pinned .BsPinAngle {
  display: none;
}
#UTC-toolbar #pin-button.pinned .BsPinAngleFill {
  display: block;
}
#UTC-toolbar #pin-button .BsPinAngle {
  display: block;
}
#UTC-toolbar #pin-button .BsPinAngleFill {
  display: none;
}
#UTC-toolbar {
  position: absolute;
  top: 12px;
  right: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
  `);

    // Keyboard shortcuts
    document.addEventListener('keydown', keydownHandler);

    // Send the coordinates of the textarea to the main process
    const { left, top, width, height } = textarea.getBoundingClientRect();
    const x = Math.floor(left + width / 2);
    const y = Math.floor(top + height / 2);
    sendCommand(`INITIALIZED: ${x}, ${y}`);
  };

  let observer;
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
      subtree: true,
    });
  }
  // END_SECTION
})();

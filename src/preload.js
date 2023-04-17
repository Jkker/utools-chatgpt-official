const CHATGPT_URL = 'https://chat.openai.com';
const LIBRARIES = [
  'chatgpt-heartbeat.js',
  // 'showdown.min.js',
  'turndown.js',
  'chatgpt-latex-render.js',
];
const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const contentScript = fs.readFileSync(
  path.join(__dirname, 'contentScript.js'),
  'utf8'
);

const libraryScripts = LIBRARIES.map((lib) =>
  fs.readFileSync(path.join(__dirname, '..', 'lib', lib), 'utf8')
);

let loaded = false;
let webview = null;
let parentId = null;

const messageQueue = [];

ipcRenderer.on('init', (event, id) => {
  parentId = event.senderId;
  console.log('init', { parentId });
});

const main = () => {
  webview = document.querySelector('webview');

  const input = (text) => {
    if (!text) return;

    webview.executeJavaScript(
      `document.querySelector('textarea[data-id="root"]').focus()`,
      true
    );
    webview.insertText(text);
  };

  ipcRenderer.on('input', (event, message) => {
    if (loaded) {
      input(message);
    } else {
      messageQueue.push(message);
    }
  });

  const onload = async () => {
    if (utools.isDev()) {
      webview.openDevTools({ mode: 'detach' });
    }
    const url = webview.getURL();

    if (!url.startsWith(CHATGPT_URL)) return;

    loaded = true;

    // Load Libraries
    await Promise.all(
      libraryScripts.map((lib, index) =>
        webview.executeJavaScript(lib).catch((e) => {
          utools.showNotification(`加载库 ${LIBRARIES[index]} 失败`);
          console.log('Error loading library', LIBRARIES[index], e);
        })
      )
    );
    // Load Content Script
    await webview.executeJavaScript(contentScript);

    if (messageQueue.length > 0) {
      input(messageQueue.shift());
    }
  };

  webview.addEventListener('did-navigate', onload);

  // React to messages from the webview if it is a command
  webview.addEventListener('console-message', async (event) => {
    if (!event.message.startsWith('!_COMMAND_')) return;
    const message = event.message.replace('!_COMMAND_', '');

    switch (message) {
      case 'PIN':
        ipcRenderer.sendTo(parentId, 'pin');
        break;
      case 'UNPIN':
        ipcRenderer.sendTo(parentId, 'unpin');
        break;
      case 'ZOOM_IN':
        webview.setZoomLevel(webview.getZoomLevel() + 1);
        break;
      case 'ZOOM_OUT':
        webview.setZoomLevel(webview.getZoomLevel() - 1);
        break;
      case 'ZOOM_RESET':
        webview.setZoomLevel(0);
        break;
      default:
        break;
    }

    // A workaround to focus the textarea
    if (message.startsWith('INITIALIZED')) {
      console.log(message);
      const matches = message.match(/INITIALIZED:\s*(\d+),\s*(\d+)/);
      const x = parseInt(matches[1]);
      const y = parseInt(matches[2]);

      console.log(`x: ${x}, y: ${y}`); // Output: x: 42, y: 99
      webview.sendInputEvent({
        type: 'mouseDown',
        x,
        y,
        button: 'left',
        clickCount: 1,
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  main();
});

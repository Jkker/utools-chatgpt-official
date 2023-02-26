const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const contentScript = fs.readFileSync(
  path.join(__dirname, 'contentScript.js'),
  'utf8'
);

let loaded = false;
let webview = null;
let parentId = null;

const messageQueue = [];

ipcRenderer.on('init', (event, id) => {
  parentId = event.senderId;
  console.log('init', { parentId });
});

const send = (event, ...arg) => {
  if (!parentId) return;
  ipcRenderer.sendTo(parentId, event, ...arg);
  console.log('⬆️ send', event, ...arg);
};
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

  ipcRenderer.on('close', (event) => {
    console.log('close', event);

    if (webview) {
      webview.closeDevTools();
    }
  });
  ipcRenderer.on('input', (event, message) => {
    if (loaded) {
      input(message);
    } else {
      messageQueue.push(message);
    }
  });

  const onload = async () => {
    const url = webview.getURL();
    console.log(`🚀 ~ file: preload.js:56 ~ onload ~ url:`, url);

    if (url !== 'https://chat.openai.com/chat') return;

    // webview.openDevTools({ mode: 'detach' });
    // console.log('CHATGPT dom-ready', { messageQueue });
    loaded = true;

    await webview.executeJavaScript(contentScript, true);
    // await webview.executeJavaScript(toolboxScript, true);

    if (messageQueue.length > 0) {
      input(messageQueue.shift());
    }
  };

  // webview.addEventListener('dom-ready', onload);
  webview.addEventListener('did-navigate', onload);

  webview.addEventListener('ipc-message', (event) => {
    // console.log('CHATGPT ipc-message', event);
  });
};
let pinned = false;

document.addEventListener('DOMContentLoaded', () => {
  console.log('WINDOW DOMContentLoaded');
  const pinButton = document.getElementById('pin-button');
  pinButton.addEventListener('click', () => {
    // console.log('pin-button click');
    pinButton.classList.toggle('pinned');
    ipcRenderer.sendTo(parentId, pinned ? 'unpin' : 'pin');
    pinned = !pinned;
    pinButton.title = pinned ? '取消置顶' : '置顶';
  });

  const reloadButton = document.getElementById('reload-button');
  reloadButton.addEventListener('click', () => {
    // console.log('reload-button click');
    if (webview.getURL() === 'https://chat.openai.com/chat') {
      webview.reload();
    } else {
      webview.loadURL('https://chat.openai.com/chat');
    }
  });

  // webview.focus();
  main();
});

// const init = () => {};

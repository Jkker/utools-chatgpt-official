const CHATGPT_URL = 'https://chat.openai.com/chat';
const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const contentScript = fs.readFileSync(
  path.join(__dirname, 'contentScript.js'),
  'utf8'
);

const showdown = fs.readFileSync(
  path.join(__dirname, 'pkgs', 'showdown.min.js'),
  'utf8'
);

const latexRender = fs.readFileSync(
  path.join(__dirname, 'pkgs', 'chatgpt-latex-render.js'),
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

let pinned = false;
const togglePin = () => {
  // console.log('pin-button click');
  const pinButton = document.getElementById('pin-button');
  pinButton.classList.toggle('pinned');
  ipcRenderer.sendTo(parentId, pinned ? 'unpin' : 'pin');
  pinned = !pinned;
  pinButton.title = pinned ? '取消置顶' : '置顶';
};

const reload = () => {
  if (webview.getURL().startsWith(CHATGPT_URL)) {
    webview.reload();
  } else {
    webview.loadURL(CHATGPT_URL);
  }
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

    if (!url.startsWith(CHATGPT_URL)) return;

    webview.openDevTools({ mode: 'detach' });
    loaded = true;

    await webview.executeJavaScript(showdown, true);
    await webview.executeJavaScript(latexRender, true);
    // await webview.executeJavaScript(mathjax, true);
    await webview.executeJavaScript(contentScript, true);

    if (messageQueue.length > 0) {
      input(messageQueue.shift());
    }
  };

  webview.addEventListener('did-navigate', onload);

  webview.addEventListener('console-message', (event) => {
    // console.log('CHATGPT console-message', event);
    const { level, message } = event;
    if (message === 'TOGGLE_PIN') {
      togglePin();
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('WINDOW DOMContentLoaded');

  document
    .getElementById('pin-button')
    .addEventListener('click', () => togglePin());
  document
    .getElementById('reload-button')
    .addEventListener('click', () => reload());

  document.getElementById('copy-button').addEventListener('click', () => {
    webview.focus();
    webview.executeJavaScript('window.copyChatAsMarkdown()');
    utools.showNotification('已复制对话为 Markdown');
  });

  document.getElementById('save-button').addEventListener('click', () => {
    webview.executeJavaScript('window.saveChatAsMarkdown()');
  });

  main();
});

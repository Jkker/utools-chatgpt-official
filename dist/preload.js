const { ipcRenderer } = require('electron');
const debounce = require('lodash.debounce');

let parentId = null;
let queuedInput = '';

ipcRenderer.on('init', (event, input) => {
  parentId = event.senderId;
  queuedInput = input;
  console.log('init', { parentId });
});

const main = () => {
  const API = {
    isPinned: false,
    pin() {
      ipcRenderer.sendTo(parentId, 'pin');
      this.isPinned = true;
      return this.isPinned;
    },
    unpin() {
      ipcRenderer.sendTo(parentId, 'unpin');
      this.isPinned = false;
      return this.isPinned;
    },
    togglePin() {
      if (this.isPinned) {
        return this.unpin();
      } else {
        return this.pin();
      }
    },
    getQueuedInput: () => {
      const i = queuedInput;
      queuedInput = '';
      return i;
    },
    toggleWindowDevTools: () => {
      ipcRenderer.sendTo(parentId, 'toggle-dev-tools');
    },
    updatePageTitle: debounce((title) => {
      ipcRenderer.sendTo(parentId, 'update-page-title', title);
    }, 200),
  };
  window.API = API;

  // webview.addEventListener('did-navigate', onload);
};

document.addEventListener('DOMContentLoaded', () => {
  main();
});

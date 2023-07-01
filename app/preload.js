const { ipcRenderer } = require('electron');
const debounce = require('lodash.debounce');

let parentId = null;
let queuedInput = '';

ipcRenderer.on('init', (event, input) => {
  parentId = event.senderId;
  queuedInput = input;
  console.log('init', { parentId, input });
});

const main = () => {
  window.API = {
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
      if (this.isPinned) this.unpin();
      else this.pin();
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

    onPromptInsert: (callback) =>
      ipcRenderer.on('insert-prompt', (event, input) => callback(input)),
  };
};

document.addEventListener('DOMContentLoaded', () => {
  main();
});

const log = require('./logger')(__filename);
const { ipcRenderer } = require('electron');

let win = null;

// const send = (event, ...arg) => {
//   if (!win?.webContents?.id) return;
//   ipcRenderer.sendTo(win?.webContents?.id, event, ...arg);
// };

/** @type {Electron.BrowserWindowConstructorOptions}*/
const windowOptions = {
  title: 'ChatGPT',
  width: 1200,
  height: 900,
  frame: true,
  show: true,
  webPreferences: {
    preload: './preload.js',
    devTools: true,
    webviewTag: true,
    contextIsolation: false,
    allowPopups: true,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    nodeIntegrationInSubFrames: true,
  },
};

const createWindow = (queuedInput = '') => {
  if (win && !win.isDestroyed()) {
    try {
      return win.show();
    } catch (e) {
      log('❌ Cannot show window: ' + e);
    }
  }

  /** @type {Electron.BrowserWindow} */
  win = utools.createBrowserWindow('./index.html', windowOptions, () => {
    win.focus();
    if (utools.isDev()) win.webContents.openDevTools();
    ipcRenderer.sendTo(win?.webContents?.id, 'init', queuedInput);
  });

  // change window title to match page title
};

ipcRenderer.on('pin', (event) => {
  win?.setAlwaysOnTop(true);
});

ipcRenderer.on('unpin', (event) => {
  win?.setAlwaysOnTop(false);
});
ipcRenderer.on('toggle-dev-tools', (event) => {
  win?.webContents?.toggleDevTools();
});
ipcRenderer.on('update-page-title', (event, title) => {
  log(`🚀 update-page-title`, title);
  win?.setTitle(title);
});

window.exports = {
  'Open ChatGPT': {
    mode: 'none',
    args: {
      enter: async ({ type, payload }) => {
        log(`⬇️ Enter`, { type, payload });
        utools.hideMainWindow();
        createWindow(type === 'over' ? payload : '');
      },
    },
  },
};

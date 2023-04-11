// const log = require('./logger')(__filename);
const { ipcRenderer } = require('electron');

let win = null;

const notify = (title) => {
  utools.showNotification(title);
};

const send = (event, ...arg) => {
  if (!win?.webContents?.id) return;
  ipcRenderer.sendTo(win?.webContents?.id, event, ...arg);
  // log('⬆️ send', event, ...arg);
};

const createWindow = () => {
  if (win) {
    try {
      win.destroy();
    } catch (e) {}
  }

  win = utools.createBrowserWindow(
    './src/index.html',
    {
      // @ts-ignore
      title: 'ChatGPT',
      width: 1200,
      height: 900,
      frame: true,
      show: true,
      webPreferences: {
        preload: './src/preload.js',
        devTools: true,
        webviewTag: true,
      },
    },
    () => {
      // win.focus();
      send('init');
      if (utools.isDev()) win.webContents.openDevTools();
      if (type === 'over') send('input', payload);
    }
  );
  // log('Window Created', {
  //   win,
  //   isNormal: win.isNormal(),
  //   isMinimized: win.isMinimized(),
  //   isVisiable: win.isVisible(),
  //   isEnabled: win.isEnabled(),
  //   isFullScreen: win.isFullScreen(),
  // });
};

ipcRenderer.on('pin', (event) => {
  // log('pin', event);
  win?.setAlwaysOnTop(true);
});

ipcRenderer.on('unpin', (event) => {
  // log('unpin', event);
  win?.setAlwaysOnTop(false);
});

window.exports = {
  'Open ChatGPT': {
    // 注意：键对应的是 plugin.json 中的 features.code
    mode: 'none', // 用于无需 UI 显示，执行一些简单的代码
    args: {
      // 进入插件应用时调用
      enter: async ({ code, type, payload }) => {
        // log('⬇️ Enter', { code, type, payload });
        try {
          utools.hideMainWindow();
          utools.outPlugin();
          if (win !== null) {
            try {
              win?.show();
            } catch (e) {
              // log('❌ cannot show window');
              createWindow();
            }
            // match any input
          } else createWindow();
          if (type === 'over') send('input', payload);
        } catch (e) {
          // log('❌', e);
        }
      },
    },
  },
};

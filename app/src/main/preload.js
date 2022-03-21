const { contextBridge, ipcRenderer } = require('electron');

const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    store: {
      get(val) {
        return ipcRenderer.sendSync('electron-store-get', val);
      },
      set(property, val) {
        ipcRenderer.send('electron-store-set', property, val);
      },
    },
    registerGlobalShortcuts(old_key) {
      ipcRenderer.send('add-global-shortcut', old_key);
    },
    openExternalLink(href) {
      ipcRenderer.send('open-external-link', href);
    },
    on(channel, func) {
      const validChannels = ['add-song-to-playlist-hotkey-pressed', 'open-url'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['add-song-to-playlist-hotkey-pressed', 'open-url'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  env: {
    isDev,
    SPOTIFY_AUTH_URL: isDev
      ? 'http://localhost:8787/auth/'
      : 'https://spotify-hotkeys-production.jorrinkievit.workers.dev/auth/',
  },
});

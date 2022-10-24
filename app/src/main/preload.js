const { contextBridge, ipcRenderer } = require('electron');

const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    store: {
      get(val) {
        return ipcRenderer.sendSync('electron_store_get', val);
      },
      set(property, val) {
        ipcRenderer.send('electron_store_set', property, val);
      },
    },
    registerGlobalShortcuts(old_key, storeType) {
      ipcRenderer.send('add_global_shortcut', old_key, storeType);
    },
    showNotification(options) {
      ipcRenderer.send('show_notification', options);
    },
    openExternalLink(href) {
      ipcRenderer.send('open_external_link', href);
    },
    on(channel, func) {
      const validChannels = [
        'add_song_to_playlist_hotkey__pressed',
        'add_song_to_liked_songs_hotkey__pressed',
        'open_url',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [
        'add_song_to_playlist_hotkey__pressed',
        'add_song_to_liked_songs_hotkey__pressed',
        'open_url',
      ];
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

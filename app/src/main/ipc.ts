import { ipcMain, globalShortcut, shell } from 'electron';
import path from 'path';
import notifier from 'node-notifier';
import { HotkeysSchema } from './storeSchema.types';
import { store } from './store';

ipcMain.on(
  'add_global_shortcut',
  async (event, old_key, keyType: keyof HotkeysSchema) => {
    if (old_key) {
      globalShortcut.unregister(old_key);
    }
    const hotkey = store.get('hotkeys')[keyType];
    globalShortcut.register(hotkey.key, () => {
      event.reply(`${keyType}__pressed`);
    });
  }
);

ipcMain.on('show_notification', (event, options) => {
  const iconUrl = path.join(__dirname, '/../assets/icon.ico');
  options.icon = iconUrl;
  options.appID = 'org.erb.SpotifyHotkeys';
  notifier.notify(options);
});

ipcMain.on('open_external_link', (event, href) => {
  shell.openExternal(href);
});

// IPC listener
ipcMain.on('electron_store_get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron_store_set', async (event, key, val) => {
  store.set(key, val);
});

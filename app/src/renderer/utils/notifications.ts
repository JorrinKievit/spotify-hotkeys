import { getStore } from './store';

// eslint-disable-next-line import/prefer-default-export
export const showNotification = (title: string, message: string) => {
  const storeSettings = getStore().get('settings');

  if (storeSettings.show_notifications) {
    window.electron.ipcRenderer.showNotification({
      title,
      message,
    });
  }
};

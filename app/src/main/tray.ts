import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';

export default class TrayBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildTray(): Tray {
    const tray = new Tray(path.join(__dirname, '/../assets/icon.ico'));
    const menu = Menu.buildFromTemplate(this.buildDefaultTemplate());

    tray.setContextMenu(menu);
    tray.setToolTip('SpotifyHotkeys');

    tray.on('double-click', () => {
      this.mainWindow.show();
    });

    return tray;
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: 'Show App',
        click: () => {
          this.mainWindow.show();
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ];

    return templateDefault;
  }
}

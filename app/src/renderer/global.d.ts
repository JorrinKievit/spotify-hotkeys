import Store from 'electron-store';
import { StoreSchema } from '../main/storeSchema';

export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        store: Store<StoreSchema>;
        registerGlobalShortcuts: (old_key: string) => void;
        openExternalLink: (href: string) => void;
        on: (channel: any, func: any) => void;
        once: (channel: any, func: any) => void;
      };
      env: {
        isDev: boolean;
        SPOTIFY_AUTH_URL: string;
      };
    };
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    greyTint: Palette['primary'];
  }
  interface PaletteOptions {
    greyTint: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    greyTint: true;
  }
}

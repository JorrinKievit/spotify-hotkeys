import Store from 'electron-store';
import { HotkeysSchema, StoreSchema } from './main/storeSchema.types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        store: Store<StoreSchema>;
        registerGlobalShortcuts: (
          old_key: string,
          keyType: keyof HotkeysSchema
        ) => void;
        showNotification: (options: any) => void;
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

declare global {
  namespace Intl {
    type ListType = 'conjunction' | 'disjunction';

    interface ListFormatOptions {
      localeMatcher?: 'lookup' | 'best fit';
      type?: ListType;
      style?: 'long' | 'short' | 'narrow';
    }

    interface ListFormatPart {
      type: 'element' | 'literal';
      value: string;
    }

    class ListFormat {
      constructor(locales?: string | string[], options?: ListFormatOptions);
      format(values: any[]): string;
      formatToParts(values: any[]): ListFormatPart[];
      supportedLocalesOf(
        locales: string | string[],
        options?: ListFormatOptions
      ): string[];
    }
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

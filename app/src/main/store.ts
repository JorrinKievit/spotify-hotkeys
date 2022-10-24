import Store from 'electron-store';
import { StoreSchema } from './storeSchema.types';

// eslint-disable-next-line import/prefer-default-export
export const store = new Store<StoreSchema>({
  defaults: {
    access_token: '',
    refresh_token: '',
    hotkeys: {
      add_song_to_liked_songs_hotkey: { key: '' },
      add_song_to_playlist_hotkey: { key: '', playlist_id: '' },
    },
    acquired_token_date: undefined,
    settings: {
      show_notifications: true,
    },
  },
});

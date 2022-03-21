export interface StoreSchema {
  access_token: string;
  refresh_token: string;
  acquired_token_date?: Date;
  add_song_to_playlist_hotkey: Hotkey;
}

interface Hotkey {
  key: string;
  playlist_id: string;
}

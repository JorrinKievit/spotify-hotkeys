export interface StoreSchema {
  access_token: string;
  refresh_token: string;
  acquired_token_date?: Date;
  hotkeys: HotkeysSchema;
  settings: SettingsSchema;
}

export interface HotkeysSchema {
  add_song_to_liked_songs_hotkey: Omit<HotkeySchema, 'playlist_id'>;
  add_song_to_playlist_hotkey: HotkeySchema;
}

export interface HotkeySchema {
  key: string;
  playlist_id: string;
}

export interface SettingsSchema {
  show_notifications: boolean;
}

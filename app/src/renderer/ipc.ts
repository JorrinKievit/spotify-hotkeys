import { SnackbarEvent } from './types';
import useSpotifyApi from './utils/spotifyApi';
import { getStore } from './utils/store';

const store = getStore();

window.electron.ipcRenderer.on(
  'add-song-to-playlist-hotkey-pressed',
  async () => {
    const spotifyApi = useSpotifyApi();
    const hotkey = window.electron.ipcRenderer.store.get(
      'add_song_to_playlist_hotkey'
    );

    const items: SpotifyApi.PlaylistTrackObject[] = [];

    let playlist = await spotifyApi.getPlaylistTracks(hotkey.playlist_id);
    items.push(...playlist.items);

    let offset = 0;
    while (playlist.next) {
      offset += 100;
      // eslint-disable-next-line no-await-in-loop
      playlist = await spotifyApi.getPlaylistTracks(hotkey.playlist_id, {
        offset,
      });
      items.push(...playlist.items);
    }

    const track = await spotifyApi.getMyCurrentPlayingTrack();
    const isInPlaylist = items.some((item) => item.track.id === track.item?.id);

    if (isInPlaylist) {
      document.dispatchEvent(
        new CustomEvent<SnackbarEvent>('open-snackbar', {
          detail: {
            message: 'This song is already in your playlist!',
            severity: 'error',
          },
        })
      );
      return;
    }

    if (track) {
      spotifyApi.addTracksToPlaylist(hotkey.playlist_id, [
        track.item?.uri as string,
      ]);
    }
  }
);

window.electron.ipcRenderer.on('open-url', (url: string) => {
  const query = url.split('?');
  const accessToken = query[1].split('&')[0].split('=')[1];
  const refreshToken = query[1].split('&')[1].split('=')[1];
  store.set('access_token', accessToken);
  store.set('refresh_token', refreshToken);
  store.set('acquired_token_date', new Date());

  const event = new Event('token-acquired');
  document.dispatchEvent(event);
});

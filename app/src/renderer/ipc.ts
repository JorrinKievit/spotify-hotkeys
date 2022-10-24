import { showNotification } from './utils/notifications';
import getSpotifyApi from './utils/spotifyApi';
import { getStore } from './utils/store';

const store = getStore();
// eslint-disable-next-line react-hooks/rules-of-hooks
const spotifyApi = getSpotifyApi();

window.electron.ipcRenderer.on(
  'add_song_to_liked_songs_hotkey__pressed',
  async () => {
    const track = await spotifyApi.getMyCurrentPlayingTrack();

    if (track && track.item) {
      spotifyApi.addToMySavedTracks([track.item.id]);
      showNotification(
        'Success!',
        `Successfully added ${track.item?.name} to Your Music Library`
      );
    } else {
      showNotification('Error!', 'No song is currently playing!');
    }
  }
);

window.electron.ipcRenderer.on(
  'add_song_to_playlist_hotkey__pressed',
  async () => {
    const hotkey = store.get('hotkeys').add_song_to_playlist_hotkey;

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
      showNotification('Error!', 'This song is already in your playlist!');
      return;
    }

    if (track) {
      spotifyApi.addTracksToPlaylist(hotkey.playlist_id, [
        track.item?.uri as string,
      ]);

      const formatter = new Intl.ListFormat('en', {
        style: 'long',
        type: 'conjunction',
      });

      showNotification(
        'Success!',
        `Successfully added ${track.item?.name} by ${formatter.format(
          track.item
            ? track.item.artists.map((artist) => artist.name)
            : ['No artist found']
        )}`
      );
    } else {
      showNotification('Error!', 'No song is currently playing!');
    }
  }
);

window.electron.ipcRenderer.on('open_url', (url: string) => {
  const query = url.split('?');
  const accessToken = query[1].split('&')[0].split('=')[1];
  const refreshToken = query[1].split('&')[1].split('=')[1];
  store.set('access_token', accessToken);
  store.set('refresh_token', refreshToken);
  store.set('acquired_token_date', new Date());
  spotifyApi.setAccessToken(accessToken);

  const event = new Event('token-acquired');
  document.dispatchEvent(event);
});

import SpotifyWebApi from 'spotify-web-api-js';
import { getStore } from './store';

let spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
const store = getStore();

export const fetchRefreshToken = async () => {
  const data = await fetch(
    `${window.electron.env.SPOTIFY_AUTH_URL}refresh?refresh_token=${store.get(
      'refresh_token'
    )}`
  );

  if (data.status === 200) {
    const json = await data.json();
    store.set('access_token', json.access_token);
    store.set('acquired_token_date', new Date());

    spotifyApi.setAccessToken(json.access_token);
  }
};

const getSpotifyApi = () => {
  if (spotifyApi === undefined) {
    spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(store.get('access_token'));
  }
  return spotifyApi;
};

export default getSpotifyApi;

import { interceptXMLHttpRequest } from '@mswjs/interceptors/lib/interceptors/XMLHttpRequest';
import { createInterceptor } from '@mswjs/interceptors';
import { getStore } from './store';
import { fetchRefreshToken } from './spotifyApi';

const store = getStore();

const interceptor = createInterceptor({
  modules: [interceptXMLHttpRequest],
  async resolver(request) {
    if (request.url.href.includes('https://api.spotify.com/v1/')) {
      const newDate = new Date();
      const acquiredDate = new Date(store.get('acquired_token_date') as Date);
      if ((newDate.getTime() - acquiredDate.getTime()) / 1000 > 3600) {
        await fetchRefreshToken();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        request.headers.set(
          'Authorization',
          `Bearer ${store.get('access_token')}`
        );
      }
    }
  },
});
interceptor.apply();

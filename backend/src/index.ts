import { Request, Router } from 'itty-router'
import {
  generateRandomString,
  getCallbackTemplate,
  getLoginTemplate,
} from './utils/utils'

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
// eslint-disable-next-line no-var
var ACCESS_TOKEN = ''

const router = Router()

router.get('/auth/login', (req) => {
  const scopes = [
    'user-read-currently-playing',
    'user-read-private',
    'user-follow-modify',
    'user-library-modify',
    'playlist-modify-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
  ]
  const state = generateRandomString(16)

  const query = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
  })
  return new Response(
    getLoginTemplate(`${SPOTIFY_AUTH_URL}?${query.toString()}`),
    {
      headers: { 'Content-Type': 'text/html' },
    },
  )
})

router.get('/auth/callback', async (req) => {
  const code = req.query?.code
  const error = req.query?.error

  const authOptions = {
    method: 'POST',
    body: new URLSearchParams({
      code: code as string,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET_ID).toString(
          'base64',
        ),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  }

  const data = await fetch(SPOTIFY_TOKEN_URL, authOptions)
  const json: any = await data.json()
  if (data.status === 200) {
    ACCESS_TOKEN = json.access_token
    return new Response(
      getCallbackTemplate(
        `spotify-shortcuts://?${new URLSearchParams({
          access_token: ACCESS_TOKEN,
          refresh_token: json.refresh_token,
        }).toString()}`,
      ),
      { headers: { 'Content-Type': 'text/html' } },
    )
  }
})

router.get('/auth/token', () => {
  return new Response(JSON.stringify(ACCESS_TOKEN))
})

router.get('/auth/refresh', async (req) => {
  const refreshToken = req.query?.refresh_token

  const authOptions = {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken as string,
    }),
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET_ID).toString(
          'base64',
        ),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  }

  const data = await fetch(SPOTIFY_TOKEN_URL, authOptions)
  const json: any = await data.json()
  if (data.status === 200) {
    ACCESS_TOKEN = json.access_token
    const headers = new Headers()
    headers.set('Access-Control-Allow-Origin', '*')
    return new Response(JSON.stringify({ access_token: ACCESS_TOKEN }), {
      headers,
    })
  } else {
    return new Response('Failed to refresh token', { status: 500 })
  }
})

router.get('/test', () => {
  return new Response(JSON.stringify(SPOTIFY_REDIRECT_URI))
})

router.all('*', () => new Response('404, not found!', { status: 404 }))

addEventListener(
  'fetch',
  (event: { respondWith: (arg0: any) => void; request: Request }) => {
    event.respondWith(router.handle(event.request))
  },
)

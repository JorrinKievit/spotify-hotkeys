export const generateRandomString = (length: number): string => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const CSS = `<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  background: #1fdf64;
  display: inline-flex;
  align-items: center;
  position: relative;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 500;
  width: 300px;
  font-size: 24px;
  border-radius: 4px;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  text-decoration: none;
  padding: 8px;
  color: black;
}

.button:hover {
  background: #1dd05f;
}
</style>`

export const getLoginTemplate = (href: string): string => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Spotify Login</title>
      ${CSS}
    </head>
    <body>
      <a class="button" href=${href}>Login with Spotify</a>
    </body>
  </html>`
}

export const getCallbackTemplate = (href: string): string => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Spotify Login</title>
      ${CSS}
    </head>
    <body>
      <a class="button" href=${href}>Continue in app</a>
    </body>
  </html>`
}

import { Container } from '@mui/material';
import React, { FC, useCallback, useEffect, useState } from 'react';
import SpotifyButton from '../components/SpotifyButton';
import Hotkeys from '../components/Hotkeys';
import { getStore } from '../utils/store';

const IndexPage: FC = () => {
  const [show, setShow] = useState(false);

  const setShowToTrue = useCallback(() => setShow(true), []);

  const handleClick = () => {
    window.electron.ipcRenderer.openExternalLink(
      `${window.electron.env.SPOTIFY_AUTH_URL}login`
    );
  };

  useEffect(() => {
    document.addEventListener('token-acquired', setShowToTrue);
    return () => {
      document.removeEventListener('token-acquired', setShowToTrue);
    };
  }, [setShowToTrue]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        display: 'flex',
      }}
    >
      {show || getStore().get('access_token') ? (
        <Hotkeys />
      ) : (
        <>
          <SpotifyButton onClick={handleClick}>
            Login with Spotify
          </SpotifyButton>
        </>
      )}
    </Container>
  );
};

export default IndexPage;

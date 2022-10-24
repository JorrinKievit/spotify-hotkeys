import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Settings } from '@mui/icons-material';
import SettingsDialog from '../components/SettingsDialog';
import SpotifyButton from '../components/SpotifyButton';
import Hotkeys from '../components/Hotkeys';
import { getStore } from '../utils/store';
import getSpotifyApi from '../utils/spotifyApi';

const IndexPage: FC = () => {
  const [show, setShow] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [user, setUser] = useState<
    SpotifyApi.CurrentUsersProfileResponse | undefined
  >(undefined);

  const setShowToTrue = useCallback(() => setShow(true), []);

  const spotifyApi = getSpotifyApi();

  const handleClick = () => {
    window.electron.ipcRenderer.openExternalLink(
      `${window.electron.env.SPOTIFY_AUTH_URL}login`
    );
  };

  const handleClose = () => setShowDialog(false);

  useEffect(() => {
    document.addEventListener('token-acquired', setShowToTrue);

    const getUser = async () => {
      const spotifyUser = await spotifyApi.getMe();
      setUser(spotifyUser);
    };

    getUser();

    return () => {
      document.removeEventListener('token-acquired', setShowToTrue);
    };
  }, [setShowToTrue, spotifyApi]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {show || getStore().get('access_token') ? (
          <>
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                top: 20,
                right: 20,
              }}
            >
              <Typography fontSize={20} marginRight={2}>
                Welcome, {user?.display_name}
              </Typography>
              <IconButton onClick={() => setShowDialog(true)}>
                <Settings />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              <Hotkeys type="add_song_to_playlist_hotkey" />
              <Hotkeys type="add_song_to_liked_songs_hotkey" />
            </Stack>

            <SettingsDialog open={showDialog} onClose={handleClose} />
          </>
        ) : (
          <SpotifyButton onClick={handleClick}>
            Login with Spotify
          </SpotifyButton>
        )}
      </Box>
    </Container>
  );
};

export default IndexPage;

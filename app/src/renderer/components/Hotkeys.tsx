import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Settings } from '@mui/icons-material';
import { getStore } from '../utils/store';
import useSpotifyApi from '../utils/spotifyApi';
import HotkeysList from './HotkeysList';
import HotkeysDialog from './HotkeysDialog';

const Hotkeys: FC = () => {
  const store = getStore();
  const spotifyApi = useSpotifyApi();

  const currentHotkey = store.get('add_song_to_playlist_hotkey');

  const [selectedplaylistID, setSelectedplaylistID] = useState(
    currentHotkey.playlist_id || ''
  );
  const [playlists, setplaylists] =
    useState<SpotifyApi.ListOfUsersPlaylistsResponse>();
  const [keys, setKeys] = useState<string[]>(currentHotkey.key.split('+'));
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePlaylistsChange = (event: SelectChangeEvent) => {
    setSelectedplaylistID(event.target.value as string);
  };

  const handleSubmit = async () => {
    store.set('add_song_to_playlist_hotkey', {
      key: keys.join('+'),
      playlist_id: selectedplaylistID,
    });

    window.electron.ipcRenderer.registerGlobalShortcuts(currentHotkey.key);
  };

  const handleClose = () => setDialogOpen(false);

  const handleCallback = (hotkeys: string[]) => {
    setDialogOpen(false);
    setKeys(hotkeys);
  };

  useEffect(() => {
    const getPlaylists = async () => {
      if (spotifyApi) {
        const data = await spotifyApi.getUserPlaylists();
        setplaylists(data);
      }
    };
    getPlaylists();
  }, [spotifyApi]);

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Typography fontSize={18} textAlign="center">
          Current song
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography fontSize={24}>Press:</Typography>

          <HotkeysList keys={keys} />

          <Button
            variant="contained"
            color="greyTint"
            sx={{ minWidth: '40px' }}
            onClick={() => setDialogOpen(true)}
          >
            <Settings />
          </Button>

          <Box display="flex" flexDirection="column">
            <ArrowForwardIcon sx={{ fontSize: 64 }} />
          </Box>

          <FormControl fullWidth>
            <InputLabel id="playlists__label">Playlists</InputLabel>
            {playlists && (
              <Select
                labelId="playlists__label"
                id="playlists__select"
                value={selectedplaylistID}
                label="Playlists"
                onChange={handlePlaylistsChange}
              >
                {playlists.items.map((val) => (
                  <MenuItem value={val.id} key={val.id}>
                    {val.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>

          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Stack>
      </Box>

      <HotkeysDialog
        open={dialogOpen}
        onClose={handleClose}
        callback={handleCallback}
        keys={keys}
      />
    </>
  );
};

export default Hotkeys;

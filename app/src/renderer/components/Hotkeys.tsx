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
import ErrorIcon from '@mui/icons-material/Error';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { HotkeysSchema } from '../../main/storeSchema.types';
import { getStore } from '../utils/store';
import getSpotifyApi from '../utils/spotifyApi';
import HotkeysList from './HotkeysList';
import HotkeysDialog from './HotkeysDialog';

interface HotkeysProps {
  type: keyof HotkeysSchema;
}

const Hotkeys: FC<HotkeysProps> = ({ type }) => {
  const store = getStore();
  const spotifyApi = getSpotifyApi();

  const currentHotkey = store.get('hotkeys')[type];
  const hotkeyHasPlaylistID = 'playlist_id' in currentHotkey;

  const [selectedplaylistID, setSelectedplaylistID] = useState<
    string | undefined
  >(
    // eslint-disable-next-line no-nested-ternary
    hotkeyHasPlaylistID
      ? currentHotkey.playlist_id
        ? currentHotkey.playlist_id
        : ''
      : undefined
  );
  const [playlists, setplaylists] =
    useState<SpotifyApi.ListOfUsersPlaylistsResponse>();
  const [keys, setKeys] = useState<string[]>(
    currentHotkey.key ? currentHotkey.key.split('+') : []
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const [hotkeyChanged, setHotkeyChanged] = useState(false);
  const [playlistChanged, setPlaylistChanged] = useState(false);
  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(true);

  const handlePlaylistsChange = (event: SelectChangeEvent) => {
    setSelectedplaylistID(event.target.value as string);
    setPlaylistChanged(true);
  };

  const handleSubmit = async () => {
    store.set(`hotkeys.${type}`, {
      key: keys.join('+'),
      ...(hotkeyHasPlaylistID ? { playlist_id: selectedplaylistID } : null),
    });

    setHotkeyChanged(false);
    setPlaylistChanged(false);

    window.electron.ipcRenderer.registerGlobalShortcuts(
      currentHotkey.key,
      type
    );
  };

  const handleClose = () => setDialogOpen(false);

  const handleCallback = (hotkeys: string[]) => {
    setDialogOpen(false);
    setKeys(hotkeys);
    setHotkeyChanged(true);
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

  useEffect(() => {
    console.log('hotkey', hotkeyChanged);
    console.log('playlist', playlistChanged);
    console.log(!hotkeyChanged || !playlistChanged);
    setSaveButtonIsDisabled(!hotkeyChanged && !playlistChanged);
  }, [hotkeyChanged, playlistChanged]);

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Typography fontSize={18} textAlign="center">
          Current song
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Typography fontSize={24}>Press:</Typography>

          {keys.length > 0 ? (
            <HotkeysList keys={keys} sx={{ width: '200px' }} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Typography
                fontSize={20}
                sx={{
                  paddingRight: '5px',
                  flexShrink: 0,
                  fontWeight: 'bold',
                }}
              >
                Not set
              </Typography>
              <ErrorIcon color="error" />
            </Box>
          )}

          <Button
            variant="contained"
            color="greyTint"
            sx={{ width: '40px', flexGrow: '0', flexShrink: '0' }}
            onClick={() => setDialogOpen(true)}
          >
            <Settings />
          </Button>

          <Box display="flex" flexDirection="column">
            <ArrowForwardIcon sx={{ fontSize: 64 }} />
          </Box>
          {hotkeyHasPlaylistID ? (
            <FormControl fullWidth sx={{ flex: '1' }}>
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
          ) : (
            <Stack
              direction="row"
              spacing={1}
              sx={{ flex: '1', alignItems: 'center', justifyContent: 'center' }}
            >
              <FavoriteBorderIcon />
              <Typography fontSize={20}>Liked songs</Typography>
            </Stack>
          )}

          <Button
            variant="contained"
            color="success"
            sx={{
              width: '60px',
              flexGrow: '0',
              flexShrink: '0',
            }}
            onClick={handleSubmit}
            disabled={saveButtonIsDisabled}
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

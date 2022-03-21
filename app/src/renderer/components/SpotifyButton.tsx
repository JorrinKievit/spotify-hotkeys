import { Button, styled } from '@mui/material';

const SpotifyButton = styled(Button)({
  fontSize: 24,
  background: '#1fdf64',
  color: 'black',
  '&:hover': {
    background: '#1DD05F',
  },
});

export default SpotifyButton;

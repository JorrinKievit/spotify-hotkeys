import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import IndexPage from './pages';
import theme from './theme';

import './App.css';
import './ipc';
import './utils/interceptor';
import Snackbar from './components/Snackbar';

export const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IndexPage />
      <Outlet />
      <Snackbar />
    </ThemeProvider>
  );
};

export default App;

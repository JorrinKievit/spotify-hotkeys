import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { SnackbarEvent } from '../types';

const Snackbar: FC = () => {
  const [open, setOpen] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState<SnackbarEvent>({
    message: 'Default message',
    severity: 'error',
  });

  const setOpenToTrue = useCallback((e: CustomEvent<SnackbarEvent>) => {
    setOpen(true);
    setSnackbarProps({
      message: e.detail.message,
      severity: e.detail.severity,
    });
  }, []) as EventListener;

  const handleClose = () => setOpen(false);

  useEffect(() => {
    document.addEventListener('open-snackbar', setOpenToTrue);
    return () => {
      document.removeEventListener('open-snackbar', setOpenToTrue);
    };
  }, [setOpenToTrue]);

  return (
    <MuiSnackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert severity={snackbarProps.severity} sx={{ width: '100%' }}>
        {snackbarProps.message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;

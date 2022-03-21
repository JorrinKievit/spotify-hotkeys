import {
  Dialog,
  DialogProps,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Box,
} from '@mui/material';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ALLOWED_FIRST_KEYS } from '../constants';
import HotkeysList from './HotkeysList';

interface HotkeysDialogProps {
  callback: (keys: string[]) => void;
  dialogTitle?: string;
  dialogContentText?: string;
  keys: string[];
}

const HotkeysDialog: FC<HotkeysDialogProps & DialogProps> = ({
  open,
  onClose,
  dialogTitle = 'Set your shortcut',
  dialogContentText = 'Type in your preffered shortcut. The shortcut should start with Windows key/Command, Control, Alt or Shift',
  keys,
  callback,
}) => {
  const [recordedKeys, setRecordedkeys] = useState<string[]>(keys);

  const clearKeys = () => {
    setRecordedkeys([]);
  };

  const registerKey = (ev: KeyboardEvent) => {
    if (recordedKeys.length === 0 && ALLOWED_FIRST_KEYS.includes(ev.key)) {
      setRecordedkeys([...recordedKeys, ev.key]);
    } else if (recordedKeys.length > 0) {
      setRecordedkeys([...recordedKeys, ev.key]);
    }
  };
  const registerKeyCallback = useCallback(registerKey, [recordedKeys]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', registerKeyCallback);
    } else {
      document.removeEventListener('keydown', registerKeyCallback);
    }
    return () => {
      document.removeEventListener('keydown', registerKeyCallback);
    };
  }, [open, registerKeyCallback]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContentText}</DialogContentText>
        <Box py={2} display="flex" justifyContent="center" alignItems="center">
          <HotkeysList keys={recordedKeys} />
        </Box>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={clearKeys}>
            Clear
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => callback(recordedKeys)}
          >
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default HotkeysDialog;

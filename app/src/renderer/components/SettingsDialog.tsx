import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material';
import React, { ChangeEvent, FC, MouseEventHandler, useState } from 'react';
import { getStore } from '../utils/store';

const SettingsDialog: FC<DialogProps> = ({ open, onClose }) => {
  const store = getStore();
  const storeSettings = store.get('settings');

  const [settings, setSettings] = useState(storeSettings);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('change');
    store.set('settings', {
      ...storeSettings,
      [event.target.name]: event.target.checked,
    });
    setSettings({
      ...storeSettings,
      [event.target.name]: event.target.checked,
    });
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.show_notifications}
                  name="show_notifications"
                  onChange={handleChange}
                />
              }
              label="Desktop notifications"
            />
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose as MouseEventHandler<HTMLButtonElement>}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;

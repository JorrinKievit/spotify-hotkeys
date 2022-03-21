import { AlertColor } from '@mui/material/Alert/Alert';

export interface SnackbarEvent {
  message: string;
  severity: AlertColor;
}

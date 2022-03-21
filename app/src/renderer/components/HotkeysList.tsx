import { Stack } from '@mui/material';
import React, { FC } from 'react';
import Kbd from './Kbd';

interface HotkeysListProps {
  keys: string[];
}

const HotkeysList: FC<HotkeysListProps> = ({ keys }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {keys.map((key, i) => {
        const next = keys[i + 1];
        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            // eslint-disable-next-line react/no-array-index-key
            key={`kbd-${key}-${i}`}
          >
            <Kbd>{key}</Kbd>
            {next && <span>+</span>}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default HotkeysList;

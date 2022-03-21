import { Box } from '@mui/material';
import React, { FC } from 'react';

const Kbd: FC = ({ children }) => {
  return (
    <Box
      sx={{
        border: 'solid',
        boderColor: 'grey.600',
        borderRadius: '0.3rem',
        borderWidth: '1px 1px 3px',
        paddingInline: '0.4rem',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
};

export default Kbd;

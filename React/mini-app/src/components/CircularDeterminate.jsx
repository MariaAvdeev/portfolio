import React from 'react';
import CircularProgress, {circularProgressClasses} from '@mui/material/CircularProgress';
import { Box } from "@mui/material";

export function CircularDeterminate(props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: '#6A6A6D',
          ...theme.applyStyles('dark', {
            color: '#6A6A6D',
          }),
        })}
        size={74}
        thickness={2.7}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={(theme) => ({
          color: '#1a3899',
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
          ...theme.applyStyles('dark', {
            color: '#1a3899',
          }),
        })}
        size={74}
        thickness={2.7}
        {...props}
      />
    </Box>
  );
}

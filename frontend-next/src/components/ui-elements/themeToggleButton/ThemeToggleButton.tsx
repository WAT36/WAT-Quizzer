import React from 'react';
import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRecoilState } from 'recoil';
import { themeModeState } from '@/atoms/ThemeMode';

export const ThemeToggleButton = () => {
  const [mode, setMode] = useRecoilState(themeModeState);

  return (
    <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} size="small" aria-label="テーマ切り替え">
      {mode === 'dark' ? <LightModeIcon style={{ color: 'white' }} /> : <DarkModeIcon style={{ color: 'white' }} />}
    </IconButton>
  );
};

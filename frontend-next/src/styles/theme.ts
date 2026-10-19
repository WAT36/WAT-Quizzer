import { createTheme } from '@mui/material/styles';
import type { ThemeMode } from '@/atoms/ThemeMode';

export const createAppTheme = (mode: ThemeMode) => createTheme({ palette: { mode } });

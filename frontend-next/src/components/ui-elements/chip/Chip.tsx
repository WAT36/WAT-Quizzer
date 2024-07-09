import React from 'react';
import { Chip as MuiChip } from '@mui/material';

interface ChipProps {
  label: string;
  variant?: 'outlined' | 'filled';
}

export const Chip = ({ label, variant = 'outlined', ...props }: ChipProps) => {
  return (
    <>
      <MuiChip label={label} variant={variant} />
    </>
  );
};

import { FormControlLabel, Radio } from '@mui/material';

export interface RadioButtonProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export const RadioButton = ({ value, label, disabled }: RadioButtonProps) => {
  return (
    <>
      <FormControlLabel value={value} control={<Radio disabled={disabled} />} label={label} />
    </>
  );
};

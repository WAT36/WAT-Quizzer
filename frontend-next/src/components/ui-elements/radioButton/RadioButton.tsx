import { FormControlLabel, Radio } from '@mui/material';

export interface RadioButtonProps {
  value: string;
  label: string;
}

export const RadioButton = ({ value, label }: RadioButtonProps) => {
  return (
    <>
      <FormControlLabel value={value} control={<Radio />} label={label} />
    </>
  );
};

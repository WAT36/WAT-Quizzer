import { FormControlLabel, Radio } from '@mui/material';

export interface RadioButtonProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export const RadioButton = ({ value, label, disabled }: RadioButtonProps) => {
  return (
    <>
      <FormControlLabel
        value={value}
        control={<Radio disabled={disabled} className="text-blue-600" />}
        label={label}
        className="text-gray-700 dark:text-gray-300"
      />
    </>
  );
};

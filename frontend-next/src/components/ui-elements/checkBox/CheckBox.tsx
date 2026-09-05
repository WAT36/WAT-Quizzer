import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material';

export interface CheckboxProps {
  value: string;
  label: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
}

export const Checkbox = ({
  value,
  label,
  name,
  onChange,
  required,
  disabled,
  defaultChecked,
  checked
}: CheckboxProps) => {
  return (
    <>
      <FormControlLabel
        value={value}
        control={
          <MuiCheckbox
            onChange={onChange}
            required={required}
            disabled={disabled}
            defaultChecked={defaultChecked}
            checked={checked}
            name={name}
            className="text-blue-600"
          />
        }
        label={label}
        className="text-gray-700 dark:text-gray-300"
      />
    </>
  );
};

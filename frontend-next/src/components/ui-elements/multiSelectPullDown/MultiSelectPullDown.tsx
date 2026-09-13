import React from 'react';
import { Autocomplete, Checkbox, FormControl, TextField, SelectChangeEvent } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface MultiSelectPullDownOption {
  value: number | string;
  label: string;
}

interface MultiSelectPullDownProps {
  optionList: MultiSelectPullDownOption[];
  label?: string;
  className?: string;
  value?: string[];
  onChange?: (e: SelectChangeEvent<string[]>) => void;
}

export const MultiSelectPullDown = ({ optionList, label, className, value, onChange }: MultiSelectPullDownProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string[]>(value ?? []);

  React.useEffect(() => {
    setSelectedValue(value ?? []);
  }, [value]);

  const selectedOptions = optionList.filter((opt) => selectedValue.includes(String(opt.value)));

  return (
    <FormControl
      disabled={optionList.length <= 1 ? true : false}
      className={className}
      sx={{ minWidth: 120, maxWidth: '100%' }}
    >
      <Autocomplete
        multiple
        disableCloseOnSelect
        className="my-[8px]"
        options={optionList}
        value={selectedOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, val) => String(option.value) === String(val.value)}
        onChange={(_event, newValue) => {
          const newValues = newValue.map((v) => String(v.value));
          setSelectedValue(newValues);
          onChange &&
            onChange({
              target: { value: newValues }
            } as SelectChangeEvent<string[]>);
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                checked={selected}
                className="mr-2"
              />
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </FormControl>
  );
};

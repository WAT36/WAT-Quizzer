import React from 'react';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { getRandomStr } from 'quizzer-lib';
import { pullDownMenuProps } from '@/constants/pullDown';

interface PullDownOption {
  value: number | string;
  label: string;
}

interface PullDownProps {
  optionList: PullDownOption[];
  label?: string;
  className?: string;
  value?: number | string;
  onChange?: (e: SelectChangeEvent<number | string>) => void;
  // 選択肢が多い場合に、入力で絞り込みできるようにする
  searchable?: boolean;
}

export const PullDown = ({ optionList, label, className, value, onChange, searchable }: PullDownProps) => {
  const labelId = `quiz-file-name-${getRandomStr()}`;

  if (searchable) {
    const selectedOption = optionList.find((x) => String(x.value) === String(value)) ?? null;
    return (
      <FormControl disabled={optionList.length <= 1 ? true : false} className={`min-w-[200px] ${className || ''}`}>
        <Autocomplete
          className="my-[8px]"
          options={optionList}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, val) => String(option.value) === String(val.value)}
          value={selectedOption}
          disabled={optionList.length <= 1}
          onChange={(_event, newValue) => {
            onChange &&
              onChange({
                target: { value: newValue ? newValue.value : -1 }
              } as SelectChangeEvent<number | string>);
          }}
          renderInput={(params) => <TextField {...params} label={label || 'ファイル選択'} />}
        />
      </FormControl>
    );
  }

  const selectProps = {
    className: `my-[8px] ${className || ''}`,
    labelId,
    id: `quiz-file-id-${getRandomStr()}`,
    defaultValue: -1,
    onChange,
    ...(value && {
      value
    }),
    MenuProps: pullDownMenuProps
  };

  return (
    <FormControl disabled={optionList.length <= 1 ? true : false} className="min-w-[200px]">
      <InputLabel id={labelId} className="my-[2px]" sx={{ '&.Mui-disabled': { color: 'text.disabled' } }}>
        {label || 'ファイル選択'}
      </InputLabel>
      <Select {...selectProps}>
        <MenuItem value={-1} key={-1}>
          選択なし
        </MenuItem>
        {optionList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

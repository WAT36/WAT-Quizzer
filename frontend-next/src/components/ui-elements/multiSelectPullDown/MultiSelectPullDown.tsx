import React from 'react';
import { Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { getRandomStr } from 'quizzer-lib';
import { pullDownMenuProps } from '@/constants/pullDown';

interface MultiSelectPullDownProps {
  optionList: {
    value: number | string;
    label: string;
  }[];
  label?: string;
  className?: string;
  value?: number | string;
  onChange?: (e: SelectChangeEvent<string[]>) => void;
}

export const MultiSelectPullDown = ({ optionList, label, className, value, onChange }: MultiSelectPullDownProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value }
    } = event;
    setSelectedValue(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    onChange && onChange(event);
  };

  const renderSelectedValue = (selected: string[]) => {
    if (selected.length === 0) {
      return '';
    }

    // 選択された値に対応するラベルを取得
    const selectedLabels = selected
      .map((val) => {
        const option = optionList.find((opt) => String(opt.value) === val);
        return option ? option.label : val;
      })
      .filter(Boolean);

    if (selectedLabels.length === 0) {
      return '';
    }

    // すべての選択項目をカンマ区切りで表示
    return selectedLabels.join(', ');
  };

  const labelId = `quiz-file-name-${getRandomStr()}`;
  const selectProps = {
    className:
      'rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
    labelId,
    id: `quiz-file-id-${getRandomStr()}`,
    value: selectedValue,
    onChange: handleChange,
    MenuProps: pullDownMenuProps
  };

  return (
    <FormControl
      disabled={optionList.length <= 1 ? true : false}
      className={className}
      sx={{ minWidth: 120, maxWidth: '100%' }}
    >
      <InputLabel
        id={labelId}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        sx={{ '&.Mui-disabled': { color: '#595959' } }}
      >
        {label}
      </InputLabel>
      <Select
        {...selectProps}
        multiple
        input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >
            {renderSelectedValue(selected as string[])}
          </div>
        )}
        sx={{
          '& .MuiSelect-select': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }
        }}
      >
        {optionList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            <Checkbox checked={selectedValue.includes(String(x.value))} />
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

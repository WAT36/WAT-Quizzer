import React from 'react';
import { MenuItem, Select } from '@mui/material';
import type { PullDownOptionDto } from 'quizzer-lib';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { pullDownMenuProps, PULLDOWN_NONE_VALUE, PULLDOWN_OTHER_VALUE } from '@/constants/pullDown';

interface PullDownWithOtherProps {
  // プルダウンのaria-labelと、「その他」入力欄のラベルに使う
  label: string;
  optionList: PullDownOptionDto[];
  // PULLDOWN_NONE_VALUE:選択なし / PULLDOWN_OTHER_VALUE:その他 / それ以外:選択肢の値
  value: number;
  // 「その他」入力欄の値
  otherValue?: string;
  id?: string;
  onChange: (value: number) => void;
  onOtherChange: (value: string) => void;
}

// 選択肢に「選択なし」「その他」を付けたプルダウン。「その他」を選ぶと名前の入力欄を出す
export const PullDownWithOther = ({
  label,
  optionList,
  value,
  otherValue,
  id,
  onChange,
  onOtherChange
}: PullDownWithOtherProps) => {
  return (
    <>
      <Select
        inputProps={{ 'aria-label': label }}
        id={id}
        value={value}
        sx={{ width: 1 }}
        MenuProps={pullDownMenuProps}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <MenuItem value={PULLDOWN_NONE_VALUE}>選択なし</MenuItem>
        {optionList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            {x.label}
          </MenuItem>
        ))}
        <MenuItem value={PULLDOWN_OTHER_VALUE}>その他</MenuItem>
      </Select>
      {value === PULLDOWN_OTHER_VALUE && (
        <TextField
          label={label}
          variant="outlined"
          id={id && `${id}-other`}
          value={otherValue ?? ''}
          setStater={onOtherChange}
          className={['fullWidth']}
        />
      )}
    </>
  );
};

import type { RadioButtonProps } from '@/components/ui-elements/radioButton/RadioButton';
import { RadioButton } from '@/components/ui-elements/radioButton/RadioButton';
import { RadioGroup as MuiRadioGroup } from '@mui/material';
import React from 'react';
import { useId, useState } from 'react';

export interface RadioGroupProps {
  radioButtonProps: RadioButtonProps[];
  defaultValue: string;
  setQueryofQuizStater?: (value: string) => void;
  disabled?: boolean;
}

export const RadioGroup = ({ radioButtonProps, defaultValue, setQueryofQuizStater, disabled }: RadioGroupProps) => {
  const [radioValue, setRadioValue] = useState<string>(defaultValue);
  // 同じnameのラジオボタンはページ全体で1グループになるため、グループごとに別のnameを付ける
  const name = useId();

  // ラジオボタンの選択変更時の処理
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setRadioValue(value);
    if (setQueryofQuizStater) {
      setQueryofQuizStater(value);
    }
  };

  return (
    <>
      <MuiRadioGroup row name={name} value={radioValue} onChange={handleRadioChange}>
        {radioButtonProps.map((x) => (
          <RadioButton key={x.value} value={x.value} label={x.label} disabled={disabled}></RadioButton>
        ))}
      </MuiRadioGroup>
    </>
  );
};

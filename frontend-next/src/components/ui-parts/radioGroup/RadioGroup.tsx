import { RadioButton, RadioButtonProps } from '@/components/ui-elements/radioButton/RadioButton';
import { RadioGroup as MuiRadioGroup } from '@mui/material';
import { useState } from 'react';

export interface RadioGroupProps {
  radioButtonProps: RadioButtonProps[];
  defaultValue: string;
  setQueryofQuizStater?: (value: string) => void;
}

export const RadioGroup = ({ radioButtonProps, defaultValue, setQueryofQuizStater }: RadioGroupProps) => {
  const [radioValue, setRadioValue] = useState<string>(defaultValue);

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
      <MuiRadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={radioValue}
        defaultValue={defaultValue}
        onChange={handleRadioChange}
      >
        {radioButtonProps.map((x) => (
          <>
            <RadioButton key={x.value} value={x.value} label={x.label}></RadioButton>
          </>
        ))}
      </MuiRadioGroup>
    </>
  );
};

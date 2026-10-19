import type { CheckboxProps } from '@/components/ui-elements/checkBox/CheckBox';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { FormGroup, FormLabel } from '@mui/material';
import React from 'react';

export interface CheckboxGroupProps {
  checkboxProps: CheckboxProps[];
  setQueryofQuizStater?: (value: string, checked: boolean) => void;
  label?: string;
}

export const CheckboxGroup = ({ checkboxProps, setQueryofQuizStater, label }: CheckboxGroupProps) => {
  // チェックボックスの選択変更時の処理
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    const checked = (event.target as HTMLInputElement).checked;
    if (setQueryofQuizStater) {
      setQueryofQuizStater(value, checked);
    }
  };

  // TODO コンポーネントにForGroupを入れるべきか否か　他はないものもあるから全部統一したい
  return (
    <FormGroup row className="inline-flex flex-wrap gap-2 items-center">
      <FormLabel className="mr-4" id="demo-row-checkbox-buttons-group-section-label">
        {label}
      </FormLabel>
      {checkboxProps.map((x) => (
        <Checkbox key={x.value} onChange={handleCheck} {...x} />
      ))}
    </FormGroup>
  );
};

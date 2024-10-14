import { FormLabel } from '@mui/material';
import { RadioGroup, RadioGroupProps } from '../../radioGroup/RadioGroup';
import React from 'react';

interface RadioGroupSectionProps {
  sectionTitle: string;
  radioGroupProps: RadioGroupProps;
  disabled?: boolean;
}

export const RadioGroupSection = ({ sectionTitle, radioGroupProps, disabled }: RadioGroupSectionProps) => {
  return (
    <>
      <FormLabel id="demo-row-radio-buttons-group-section-label">{sectionTitle}</FormLabel>
      <RadioGroup
        radioButtonProps={radioGroupProps.radioButtonProps}
        defaultValue={radioGroupProps.defaultValue}
        setQueryofQuizStater={radioGroupProps.setQueryofQuizStater}
        disabled={disabled}
      />
    </>
  );
};

import { FormLabel } from '@mui/material';
import { RadioGroup, RadioGroupProps } from '../../radioGroup/RadioGroup';

interface RadioGroupSectionProps {
  sectionTitle: string;
  radioGroupProps: RadioGroupProps;
}

export const RadioGroupSection = ({ sectionTitle, radioGroupProps }: RadioGroupSectionProps) => {
  return (
    <>
      <FormLabel id="demo-row-radio-buttons-group-section-label">{sectionTitle}</FormLabel>
      <RadioGroup
        radioButtonProps={radioGroupProps.radioButtonProps}
        defaultValue={radioGroupProps.defaultValue}
        setStater={radioGroupProps.setStater}
      />
    </>
  );
};

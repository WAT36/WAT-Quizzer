import { RangeSlider } from '@/components/ui-elements/rangeSlider/RangeSlider';
import { Typography } from '@mui/material';

interface RangeSliderSectionProps {
  sectionTitle: string;
  setStater?: React.Dispatch<React.SetStateAction<number[] | number>> | ((value: number[] | number) => void);
}

export const RangeSliderSection = ({ sectionTitle, setStater }: RangeSliderSectionProps) => {
  return (
    <>
      <Typography id="range-slider" gutterBottom>
        {sectionTitle}
      </Typography>
      <RangeSlider setStater={setStater} />
    </>
  );
};

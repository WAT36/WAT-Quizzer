import React, { useState } from 'react';
import { Slider as MuiSlider } from '@mui/material';

interface RangeSliderProps {
  setStater?: React.Dispatch<React.SetStateAction<number[] | number>>;
}

export const RangeSlider = ({ setStater }: RangeSliderProps) => {
  const [value, setValue] = useState<number[] | number>([0, 100]);

  const handleChange = (event: Event, newValue: number[] | number) => {
    setValue(newValue);
    if (setStater) {
      setStater(newValue);
    }
  };

  return (
    <>
      <MuiSlider value={value} onChange={handleChange} valueLabelDisplay="auto" aria-labelledby="range-slider" />
    </>
  );
};

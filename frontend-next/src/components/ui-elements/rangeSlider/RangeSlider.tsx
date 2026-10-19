import React, { useState } from 'react';
import { Slider as MuiSlider } from '@mui/material';

interface RangeSliderProps {
  setStater?: React.Dispatch<React.SetStateAction<number[] | number>> | ((value: number[] | number) => void);
  value?: number[];
}

export const RangeSlider = ({ setStater, value }: RangeSliderProps) => {
  const [internalValue, setInternalValue] = useState<number[] | number>(value ?? [0, 100]);

  // 親から渡されたvalueが変わったら内部の値に反映する(effectを使わず描画中に前回の値と比べて更新する)
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) {
      setInternalValue(value);
    }
  }

  const handleChange = (event: Event, newValue: number[] | number) => {
    setInternalValue(newValue);
    if (setStater) {
      setStater(newValue);
    }
  };

  return (
    <>
      <MuiSlider
        value={internalValue}
        className="!mx-[8px] w-auto"
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-label="range"
        aria-labelledby="range-slider"
      />
    </>
  );
};

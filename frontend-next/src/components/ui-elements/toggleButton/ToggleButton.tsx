import React from 'react';
import { ToggleButtonGroup, ToggleButton as MuiToggleButton } from '@mui/material';

interface ToggleButtonProps<T extends string> {
  alignment: T;
  setAlignment: (value: T) => void;
  buttonValues: T[];
}

export const ToggleButton = <T extends string>({ alignment, setAlignment, buttonValues }: ToggleButtonProps<T>) => {
  // 選択中のボタンを押すとnullが渡されるが、常にどれか1つを選択した状態にするため無視する
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: T | null) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };
  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      className="mb-4"
    >
      {buttonValues.map((value) => {
        return (
          <MuiToggleButton
            key={value}
            value={value}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {value}
          </MuiToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

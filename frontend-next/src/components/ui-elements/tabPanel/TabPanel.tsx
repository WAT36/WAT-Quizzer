import React from 'react';

interface TabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

export const TabPanel = ({ index, value, children }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
    {value === index && <>{children}</>}
  </div>
);

import React from 'react';

import './headerBar.css';

interface HeaderBarProps {
  bgColor: string;
}

export const HeaderBar = ({ bgColor = '#0077B6' }: HeaderBarProps) => (
  <header style={{ backgroundColor: bgColor }}></header>
);

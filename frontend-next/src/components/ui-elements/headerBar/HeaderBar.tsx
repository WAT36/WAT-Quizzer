import React, { ReactNode } from 'react';

interface HeaderBarProps {
  bgColor: string;
  children?: ReactNode;
}

export const HeaderBar = ({ bgColor = '#006494', ...props }: HeaderBarProps) => (
  <header
    className="fixed top-0 w-full h-[44px] md:h-[48px] shadow-md"
    style={{ backgroundColor: bgColor, zIndex: 10001 }}
  >
    {props.children}
  </header>
);

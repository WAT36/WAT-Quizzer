import React, { ReactNode } from 'react';

interface FooterBarProps {
  bgColor: string;
  children?: ReactNode;
}

export const FooterBar = ({ bgColor = '#006494', ...props }: FooterBarProps) => (
  <footer
    className="fixed text-white bottom-[0px] w-full min-h-[36px] md:min-h-[40px] mt-[4px] shadow-md"
    style={{ backgroundColor: bgColor }}
  >
    {props.children}
  </footer>
);

import React from 'react';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderBar } from '../../ui-elements/headerBar/HeaderBar';

interface HeaderProps {
  bgColor: string;
  subTitle?: string;
  onClick?: (event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) => void;
}

export const Header = ({ bgColor = '#006494', subTitle, onClick }: HeaderProps) => (
  <HeaderBar bgColor={bgColor}>
    <span className="text-white font-bold block px-3 pr-10 text-sm md:text-base leading-[44px] md:leading-[48px] break-words">
      WAT Quizzer
      {subTitle && <span className="text-white font-bold">{' - ' + subTitle}</span>}
    </span>
    {onClick ? (
      <span className="absolute right-2.5 top-0 h-full flex items-center">
        <IconButton onClick={onClick} size="small" aria-label="Side Bar">
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
      </span>
    ) : (
      <></>
    )}
  </HeaderBar>
);

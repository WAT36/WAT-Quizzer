import React, { ReactNode } from 'react';

import styles from './SideBar.module.css';
import { Drawer } from '@mui/material';
import { useRecoilState } from 'recoil';
import { isOpenState } from '@/atoms/SideBar';

interface SideBarProps {
  children?: ReactNode;
}

// サイドバー開閉
export const toggleDrawer =
  (isOpen: boolean, setSidebarState: React.Dispatch<React.SetStateAction<{ open: boolean }>>) =>
  (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || 'Shift')) {
      return;
    }

    setSidebarState({ open: isOpen });
  };

export const SideBar = ({ ...props }: SideBarProps) => {
  const [sidebarState, setSidebarState] = useRecoilState(isOpenState);
  return (
    <Drawer
      className={styles.sideBar}
      anchor="right"
      open={sidebarState.open}
      onClose={toggleDrawer(false, setSidebarState)}
    >
      {props.children}
    </Drawer>
  );
};

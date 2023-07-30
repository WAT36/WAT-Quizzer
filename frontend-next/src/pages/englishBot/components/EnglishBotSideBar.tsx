import React from 'react';
import { useRecoilState } from 'recoil';

import { sideBarContents, toggleDrawer } from '../../../../utils/englishBot/SideBar';
import { isOpenState } from '../../../atoms/SideBar';
import { drawerStyle } from '../../../styles/SideBar';
import { Button, Drawer, List, ListItem } from '@mui/material';

export default function EnglishBotSideBar() {
  const [sidebarState, setSidebarState] = useRecoilState(isOpenState);

  return (
    <Drawer style={drawerStyle} anchor="right" open={sidebarState.open} onClose={toggleDrawer(false, setSidebarState)}>
      <List>
        {sideBarContents.map((value) => (
          <ListItem key={value.name}>
            <Button variant="text" href={value.link} onClick={toggleDrawer(false, setSidebarState)}>
              {value.name}
            </Button>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

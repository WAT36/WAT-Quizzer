import React from 'react'
import { useRecoilState } from 'recoil'
import { Link } from 'react-router-dom'

import { sideBarContents, toggleDrawer } from '../utils/SideBar'
import { isOpenState } from '../../../atoms/SideBar'
import { drawerStyle } from '../../../styles/SideBar'
import { Drawer, List, ListItem } from '@mui/material'

export default function QuizzerSideBar() {
  const [sidebarState, setSidebarState] = useRecoilState(isOpenState)

  return (
    <Drawer
      style={drawerStyle}
      anchor="right"
      open={sidebarState.open}
      onClose={toggleDrawer(false, setSidebarState)}
    >
      <List>
        {sideBarContents.map((value) => (
          <ListItem key={value.name}>
            <Link
              to={value.link}
              onClick={toggleDrawer(false, setSidebarState)}
            >
              {value.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

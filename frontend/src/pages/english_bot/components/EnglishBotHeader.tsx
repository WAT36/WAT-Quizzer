import React from 'react'
import { useSetRecoilState } from 'recoil'

import { isOpenState } from '../../../atoms/SideBar'
import { toggleDrawer } from '../utils/SideBar'
import {
  englishBotHeaderStyle,
  titleStyle,
  rightStyle
} from '../../../styles/Header'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function EnglishBotHeader() {
  const setSidebarState = useSetRecoilState(isOpenState)

  return (
    <header style={englishBotHeaderStyle}>
      <span style={titleStyle}>WAT Quizzer (EnglishBot)</span>
      <span className="right" style={rightStyle}>
        <IconButton onClick={toggleDrawer(true, setSidebarState)} size="small">
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
      </span>
    </header>
  )
}

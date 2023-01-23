import { IconButton } from '@material-ui/core'
import MenuIcon from '@mui/icons-material/Menu'
import React from 'react'
import { toggleDrawer } from '../utils/SideBar'
import { useSetRecoilState } from 'recoil'
import { isOpenState } from '../../../atoms/SideBar'
import {
  rightStyle,
  titleStyle,
  quizzerHeaderStyle
} from '../../../styles/Header'

export default function QuizzerHeader() {
  const setSidebarState = useSetRecoilState(isOpenState)

  return (
    <header style={quizzerHeaderStyle}>
      <span style={titleStyle}>WAT Quizzer</span>
      <span className="right" style={rightStyle}>
        <IconButton onClick={toggleDrawer(true, setSidebarState)} size="small">
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
      </span>
    </header>
  )
}

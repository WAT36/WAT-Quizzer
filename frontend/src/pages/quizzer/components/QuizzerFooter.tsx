import React from 'react'
import { Button } from '@material-ui/core'
import {
  leftStyle,
  quizzerFooterStyle,
  rightStyle
} from '../../../styles/Footer'

export default function QuizzerFooter() {
  return (
    <footer style={quizzerFooterStyle}>
      <span className="left" style={leftStyle}>
        <Button size="small" color="inherit" href="/top">
          トップ
        </Button>
      </span>
      <span className="right" style={rightStyle}>
        ©️ Tatsuroh Wakasugi
      </span>
    </footer>
  )
}

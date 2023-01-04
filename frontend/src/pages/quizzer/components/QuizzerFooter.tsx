import React from 'react'
import { Button } from '@material-ui/core'

const footerStyle = {
  position: 'fixed' as 'fixed',
  bottom: 0,
  width: '100%',
  height: '30px',
  backgroundColor: '#0077B6',
  color: 'white',
  marginTop: '5px'
}

const leftStyle = {
  position: 'absolute' as 'absolute' /*←絶対位置*/,
  left: '0px',
  lineHeight: '30px'
}

const rightStyle = {
  position: 'absolute' as 'absolute' /*←絶対位置*/,
  right: '10px',
  lineHeight: '30px'
}

export default function QuizzerFooter(){
    return (
        <footer style={footerStyle}>
            <span className="left" style={leftStyle}>
                <Button size="small" color="inherit" href="/top">トップ</Button>
            </span>
            <span className="right" style={rightStyle}>
            ©️ Tatsuroh Wakasugi
            </span>
        </footer>
    )
}

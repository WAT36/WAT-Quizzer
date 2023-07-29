import React from 'react';
import { leftStyle, quizzerFooterStyle, rightStyle } from '../../../styles/Footer';
import { Button } from '@mui/material';

export default function QuizzerFooter() {
  return (
    <footer style={quizzerFooterStyle}>
      <span className="left" style={leftStyle}>
        <Button size="small" color="inherit" href={'/top' + process.env.NEXT_PUBLIC_URL_END}>
          トップ
        </Button>
      </span>
      <span className="right" style={rightStyle}>
        ©️ Tatsuroh Wakasugi
      </span>
    </footer>
  );
}

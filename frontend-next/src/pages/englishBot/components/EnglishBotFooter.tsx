import React from 'react';
import { englishBotFooterStyle, leftStyle, rightStyle } from '../../../styles/Footer';
import { Button } from '@mui/material';

export default function EnglishBotFooter() {
  return (
    <footer style={englishBotFooterStyle}>
      <span className="left" style={leftStyle}>
        <Button size="small" color="inherit" href="/top">
          トップ
        </Button>
      </span>
      <span className="right" style={rightStyle}>
        ©️ Tatsuroh Wakasugi
      </span>
    </footer>
  );
}

import React from "react";
import { Button } from '@material-ui/core';
import { footerStyle, leftStyle, rightStyle } from '../../../styles/Footer';

export default function EnglishBotFooter() {
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
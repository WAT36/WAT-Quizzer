import React from "react";
import { Button } from '@material-ui/core';
import { footerStyle, leftStyle, rightStyle } from '../styles/Footer';

export default function EnglishBotFooter() {
    return (
        <footer style={footerStyle}>
            <span className="left" style={leftStyle}>
                <Button size="small" color="inherit" href="/top">トップ</Button>
                {/* <Link to="/selectquiz">問題出題</Link>
                <Link to="/addquiz">問題追加</Link>
                <Link to="/editquiz">問題編集</Link>
                <Link to="/searchquiz">問題検索</Link>
                <Link to="/deletequiz">問題削除</Link>
                <Link to="/accuracyrategraph">カテゴリ別正解率表示</Link>
                <Link to="/imageupload">画像アップロード</Link> */}
            </span>
            <span className="right" style={rightStyle}>
                ©️ Tatsuroh Wakasugi
            </span>
        </footer>
    )
}
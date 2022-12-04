import React from "react";
import { Button } from '@material-ui/core';

const footerStyle = {
    'position': 'fixed',
    'bottom': 0,
    'width': '100%',
    'height': '30px',
    'backgroundColor': '#0077B6',
    'color': 'white',
    'marginTop': '5px',
}

const leftStyle = {
    'position': 'absolute',/*←絶対位置*/
    'left': '0px',
    'lineHeight': '30px',
}

const rightStyle = {
    'position': 'absolute',/*←絶対位置*/
    'right': '10px',
    'lineHeight': '30px',
}

export default class QuizzerFooter extends React.Component{
    render(){
        return (
            <footer style={footerStyle}>
                <span className="left" style={leftStyle}>
                    <Button size="small" color="inherit" href="/top">トップ</Button>
                    <Button size="small" color="inherit" href="/selectquiz">問題出題</Button>
                    <Button size="small" color="inherit" href="/addquiz">問題追加</Button>
                    <Button size="small" color="inherit" href="/editquiz">問題編集</Button>
                    <Button size="small" color="inherit" href="/searchquiz">問題検索</Button>
                    <Button size="small" color="inherit" href="/deletequiz">問題削除</Button>
                    <Button size="small" color="inherit" href="/accuracyrategraph">カテゴリ別正解率表示</Button>
                    <Button size="small" color="inherit" href="/imageupload">画像アップロード</Button>
                </span>
                <span className="right" style={rightStyle}>
                ©️ Tatsuroh Wakasugi
                </span>
            </footer>
        )
    }
}
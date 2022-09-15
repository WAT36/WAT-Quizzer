import React from "react";
import { Link } from "react-router-dom";

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

export default class EnglishBotFooter extends React.Component{
    render(){
        return (
            <footer style={footerStyle}>
                <span className="left" style={leftStyle}>
                    <Link to="/top">トップ</Link>
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
}
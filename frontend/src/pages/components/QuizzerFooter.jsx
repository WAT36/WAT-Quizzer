import React from "react";

const footerStyle = {
    'height': '30px',
    'background-color': '#0077B6',
    'color': 'white',
    'margin-top': '5px',
}

const leftStyle = {
    'position': 'absolute',/*←絶対位置*/
    'left': '0px',
    'line-height': '30px',
}

const rightStyle = {
    'position': 'absolute',/*←絶対位置*/
    'right': '10px',
    'line-height': '30px',
}

export default class QuizzerFooter extends React.Component{
    render(){
        return (
            <footer style={footerStyle}>
                <span class="left" style={leftStyle}>
                    トップ
                    問題出題
                    問題追加
                    問題編集
                    問題検索
                    問題削除
                    カテゴリ別正解率表示
                    画像アップロード
                </span>
                <span class="right" style={rightStyle}>
                ©️ Tatsuroh Wakasugi
                </span>
            </footer>
        )
    }
}
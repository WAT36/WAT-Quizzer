import React from "react";
import EnglishBotHeader from "./EnglishBotHeader.tsx";
import EnglishBotFooter from "./EnglishBotFooter.tsx";
import EnglishBotSideBar from "./EnglishBotSideBar.tsx";
import { adjustedSpaceStyle } from '../styles/Layout.ts'

export default function EnglishBotLayout(props) {

    return (
        <>
            {/*ヘッダ*/}
            <EnglishBotHeader />

            {/*サイドバー*/}
            <EnglishBotSideBar />

            {/*ヘッダとコンテンツ間の調整余白 */}
            <div style={adjustedSpaceStyle}></div>

            {/*内容*/}
            {props.contents}

            {/*フッタとコンテンツ間の調整余白 */}
            <div style={adjustedSpaceStyle}></div>

            {/*フッタ*/}
            <EnglishBotFooter />
        </>
    )
}

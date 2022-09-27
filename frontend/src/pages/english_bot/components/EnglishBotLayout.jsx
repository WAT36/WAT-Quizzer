import React from "react";
import EnglishBotHeader from "./EnglishBotHeader";
import EnglishBotFooter from "./EnglishBotFooter";

const adjustedSpaceStyle = {
    'height': '40px',
}

export default class EnglishBotLayout extends React.Component{

    render(){
        return (
            <>
                {/*ヘッダ*/}
                <EnglishBotHeader />

                {/*ヘッダとコンテンツ間の調整余白 */}
                <div style={adjustedSpaceStyle}></div>

                {/*内容*/}
                {this.props.contents}

                {/*フッタとコンテンツ間の調整余白 */}
                <div style={adjustedSpaceStyle}></div>

                {/*フッタ*/}
                <EnglishBotFooter />
            </>
        )
    }
}

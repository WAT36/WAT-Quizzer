import React from "react";
import QuizzerHeader from "./QuizzerHeader";
import QuizzerFooter from "./QuizzerFooter";

const adjustedSpaceStyle = {
    'height': '40px',
}

class QuizzerLayout extends React.Component{

    render(){
        return (
            <>
                {/*ヘッダ*/}
                <QuizzerHeader />

                {/*ヘッダとコンテンツ間の調整余白 */}
                <div style={adjustedSpaceStyle}></div>

                {/*内容*/}
                {this.props.contents}

                {/*フッタとコンテンツ間の調整余白 */}
                <div style={adjustedSpaceStyle}></div>

                {/*フッタ*/}
                <QuizzerFooter />
            </>
        )
    }
}

export default QuizzerLayout;
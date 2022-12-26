import React from "react";
import QuizzerHeader from "./QuizzerHeader";
import QuizzerFooter from "./QuizzerFooter";
import QuizzerSideBar from "./QuizzerSideBar";

const adjustedSpaceStyle = {
    'height': '40px',
}

type Props = {
    contents: JSX.Element;
}

class QuizzerLayout extends React.Component<Props,{}>{

    render(){
        return (
            <>
                {/*ヘッダ*/}
                <QuizzerHeader />

                {/*サイドバー*/}
                <QuizzerSideBar />

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
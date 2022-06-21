import React from "react";
import QuizzerHeader from "./QuizzerHeader";
import QuizzerFooter from "./QuizzerFooter";

class QuizzerLayout extends React.Component{

    render(){
        return (
            <>
                {/*ヘッダ*/}
                <QuizzerHeader />

                {/*内容*/}
                {this.props.contents}

                {/*フッタ*/}
                <QuizzerFooter />
            </>
        )
    }
}

export default QuizzerLayout;
import React from "react";

import EnglishBotLayout from "./components/EnglishBotLayout";


class EnglishBotAddWordPage extends React.Component {

    contents = () => {
        return (
            <p>単語追加ページ</p>
        )
    }

    render() {
        return (
            <>
                <EnglishBotLayout
                    contents={this.contents()}
                />
            </>
        )
    }

}

export default EnglishBotAddWordPage;
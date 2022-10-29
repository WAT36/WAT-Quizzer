import React from "react";

import EnglishBotLayout from "./components/EnglishBotLayout";


class EnglishBotDictionaryPage extends React.Component {

    contents = () => {
        return (
            <>
            </>
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

export default EnglishBotDictionaryPage;
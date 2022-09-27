import React from "react";

import EnglishBotLayout from "./components/EnglishBotLayout";


class EnglishBotTopPage extends React.Component {
    render() {
        return (
            <>
                <EnglishBotLayout
                    contents={"準備中・・・\nここはダッシュボードか何かにする"}
                />
            </>
        )
    }

}

export default EnglishBotTopPage;
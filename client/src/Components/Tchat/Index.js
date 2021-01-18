import React from 'react'
import "../../Styles/tchat.css"

//Components
import Header from "../Header/Header"
import Connected from "../Connected/Connected"
import MainTchat from "./MainTchat"

export default function Index() {
    return (
        <div className="tchat">
            <Header />
            <Connected choiceCss={false} />
            <MainTchat />
        </div>
    )
}

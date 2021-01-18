import React from 'react'
import "../../Styles/gaming.css"

// Components
import Header from "../Header/Header"
import MainAccount from "./MainAccount"
import Connected from "../Connected/Connected"

export default function Index() {
    return (
        <div className="account">
            <Header />
            <MainAccount />
            <Connected choiceCss={true} />
        </div>
    )
}

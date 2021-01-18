import React from 'react'

// Components
import Header from "../Header/Header"
import MainGaming from "./MainGaming"
import Connected from "../Connected/Connected"

export default function Index() {
    return (
        <div className="gaming">
            <Header />
            <MainGaming />
            <Connected />
        </div>
    )
}

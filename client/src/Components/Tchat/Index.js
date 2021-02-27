import React from 'react'
import "../../Styles/tchat.css"

//Components
import MainTchat from "./MainTchat"
import Connected from '../Connected/Connected'

export default function Index() {
    return (
        <section className="tchat">
            <Connected />
            <MainTchat />
        </section>
    )
}

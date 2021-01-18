import React from 'react'
import {useSelector} from "react-redux"
import TchatDiv from "../TchatDiv/TchatDiv"

export default function MainTchat() {

    const themeReducer = useSelector(state => state)

    return (
        <section className={themeReducer.Theme ? "mainTchat-dark" : "mainTchat"}>
            <TchatDiv choiceCss={false} />
        </section>
    )
}

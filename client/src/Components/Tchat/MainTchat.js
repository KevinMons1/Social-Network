import React from 'react'
import {useSelector} from "react-redux"
import TchatDiv from "../TchatDiv/TchatDiv"

export default function MainTchat() {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <section className={themeReducer ? "mainTchat-dark" : "mainTchat"}>
            <TchatDiv choiceCss={false} />
        </section>
    )
}

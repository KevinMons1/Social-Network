import React from 'react'
import {useSelector} from "react-redux"
import TchatDiv from "../TchatDiv/TchatDiv"

export default function MainTchat({ data }) {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={themeReducer ? "mainTchat-dark" : "mainTchat"}>
            <TchatDiv choiceCss={false} index={true} data={data} />
        </div>
    )
}

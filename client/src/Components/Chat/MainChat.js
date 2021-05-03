import React from 'react'
import {useSelector} from "react-redux"
import ChatDiv from "../ChatDiv/ChatDiv"

export default function MainChat({ data, returnChat }) {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={themeReducer ? "mainChat-dark" : "mainChat"}>
            <ChatDiv returnChat={() => returnChat()} choiceCss={false} index={true} data={data} />
        </div>
    )
}

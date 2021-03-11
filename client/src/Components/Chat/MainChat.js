import React from 'react'
import {useSelector} from "react-redux"
import ChatDiv from "../ChatDiv/ChatDiv"

export default function MainChat({ data }) {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={themeReducer ? "mainChat-dark" : "mainChat"}>
            <ChatDiv choiceCss={false} index={true} data={data} />
        </div>
    )
}

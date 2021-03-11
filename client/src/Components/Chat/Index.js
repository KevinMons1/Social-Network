import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom"
import "../../Styles/chat.css"

//Components
import MainChat from "./MainChat"
import Connected from "../Connected/Connected"
import ChatEmpty from "./ChatEmpty"

export default function Index() {

    const [friendClick, setFriendClick] = useState(false)
    const [data, setData] = useState(null)
    const { slug } = useParams()
    const history = useHistory()

    useEffect(() => {
        if (slug.toString() != "empty") {
            setFriendClick(true)
            setData(history.location.state)
        }
    }, [])

    const handleFriendClick = (data) => {
        history.push({pathname: `/chat/${data.userId}`, state: data})
    }

    return (
        <section className="chat">
            <Connected choiceCss={false} friendClick={(data) => handleFriendClick(data)} />
            {friendClick ? <MainChat data={data} /> : <ChatEmpty />}
        </section>
    )
}

import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom"
import "../../Styles/tchat.css"

//Components
import MainTchat from "./MainTchat"
import Connected from "../Connected/Connected"
import TchatEmpty from "./TchatEmpty"

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
        history.push({pathname: `/friends/${data.userId}`, state: data})
    }

    return (
        <section className="tchat">
            <Connected choiceCss={false} friendClick={(data) => handleFriendClick(data)} />
            {friendClick ? <MainTchat data={data} /> : <TchatEmpty />}
        </section>
    )
}

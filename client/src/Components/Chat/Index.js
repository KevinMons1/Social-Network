import React, {useState, useEffect} from 'react'
import {withRouter, useHistory, useParams} from "react-router-dom"
import "../../Styles/chat.css"
import "../../Styles/Media-Queries/Tablet/chat.css"
import { useMediaQuery } from 'react-responsive'

//Components
import MainChat from "./MainChat"
import Connected from "../Connected/Connected"
import ChatEmpty from "./ChatEmpty"

export default withRouter(function Index() {

    const [friendClick, setFriendClick] = useState(false)
    const [data, setData] = useState(null)
    const { slug } = useParams()
    const history = useHistory()
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })

    useEffect(() => {
        if (slug.toString() !== "empty") {
            setFriendClick(true)
            setData(history.location.state)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    console.log(friendClick) //!!! Continuer ici, vérifier le clikc pour faire disparaitre Connectec

    const handleFriendClick = (data) => {
        history.push({pathname: `/chat/${data.userId}`, state: data})
    }

    return isTabletOrMobile ? (
        <section className="chat">
            <Connected choiceCss={false} friendClick={(data) => handleFriendClick(data)} />
            {friendClick ? <MainChat data={data} /> : <ChatEmpty />}
        </section>
    ) : (
        <section className="chat">
            {friendClick ? <Connected choiceCss={false} friendClick={(data) => handleFriendClick(data)} /> : null}
            {friendClick ? <MainChat data={data} /> : <ChatEmpty />}
        </section>
    )
})

import React, {useState, useEffect} from 'react'
import {withRouter, useHistory, useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import "../../Styles/chat.css"
import "../../Styles/Media-Queries/Tablet/chat.css"
import "../../Styles/Media-Queries/MobileL/chat.css"
import { useMediaQuery } from 'react-responsive'
import {Helmet} from "react-helmet"

//Components
import MainChat from "./MainChat"
import Connected from "../Connected/Connected"
import ChatEmpty from "./ChatEmpty"

export default withRouter(function Index() {

    const userDataReducer = useSelector(state => state.UserData)
    const [friendClick, setFriendClick] = useState(false)
    const [changeTitle, setChangeTitle] = useState("Chat - empty")
    const [data, setData] = useState(null)
    const { slug } = useParams()
    const history = useHistory()
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })

    useEffect(() => {
        if (slug.toString() !== "empty") {
            setFriendClick(true)
            setData(history.location.state)
            setChangeTitle(`Chat - ${history.location.state.lastName} ${history.location.state.firstName}`)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    const handleFriendClick = (data) => {
        history.push({pathname: `/chat/${data.userId}-${userDataReducer.userId}`, state: data})
    }

    const handleReturnChat = () => {
        history.push({pathname: `/chat/empty`})
        setFriendClick(false)
    }

    return isTabletOrMobile ? (
        <section className="chat">
            {friendClick 
            ?   <MainChat returnChat={() => handleReturnChat()} data={data} />
            :   <Connected choiceCss={false} friendClick={(data) => handleFriendClick(data)} />               
            }
        </section>
    ) : (
        <section className="chat">
            <Helmet>
                <title>{changeTitle}</title>
            </Helmet>
            <Connected choiceCss={false} friendClick={(data) => handleFriendClick(data)} />
            {friendClick ? <MainChat data={data} /> : <ChatEmpty />}
        </section>
    )
})

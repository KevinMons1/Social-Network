import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux"
import "../../Styles/tchat.css"
import {useParams} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import io from 'socket.io-client'
import UserCard from '../Connected/UserCard'
import Message from "./Message"

const socket = io("localhost:3001")

export default function TchatDiv({choiceCss, closeTchat, data, index}) {
    
    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [load, setLoad] = useState(false)
    const [allMessages, setAllMessages] = useState([])
    const [roomId, setRoomId] = useState(null)
    const messageRef = useRef()
    const dispatch = useDispatch()
    const { slug } = useParams()
    const [message, setMessage] = useState({
        text: "",
        sender: userDataReducer.userId,
        receiver: data.userId
    })

    /*
    ----- Socket.io for a real time chat -----
    */

    // Get userConnected
    // socket.on('userConnected', friend => {
    //     console.log(friend)
    // }) 

    // Send message
    socket.on('newMessage', dataMessage => {
        if (dataMessage.sender.toString() === slug.toString()) {
            setAllMessages([...allMessages, <Message data={dataMessage} isMe={false} />])
        }
    })

    useEffect(() => {
        
    }, [slug])
    
    useEffect(() => {
        const fetch = async () => {
            await dispatch({
                type: "CHANGE_ZINDEX",
                payload: index
            })

            // get roomId
            await axios.post(`http://localhost:3001/api/chat/getRoom/${slug}`, {userId: userDataReducer.userId})
                .then(res => {
                    setRoomId(res.data.roomId)
                })
                .catch(err => console.log(err))
            // get message in room with roomId
            // await axios.get(`http://localhost:3001/api/chat/getMessages/${roomId}`)
            //     .then(res => { 
            //         console.log(res.data)
            //     })
            //     .catch(err => console.log(err))
    
            // send my connection
            await socket.emit('userConnected', userDataReducer.userId)

            setLoad(true)
        }
        fetch()
    }, [slug])

    const handleSubmit = e => {
        e.preventDefault()
        setAllMessages([...allMessages, <Message data={message} isMe={true} />])

        socket.emit('sendMessage', message)

        axios.post(`http://localhost:3001/api/chat/addMessage/${roomId}`, message)
            .then(res => console.log(res))
            .catch(err => console.log(err))

        setMessage({...message, text: ""})
        messageRef.current.value = ""
    }

    const choiceContainer = choiceCss ? "tchatDiv-container-mini" : "tchatDiv-container"
    const choiceTop = choiceCss ? "tchatDiv-top-mini" : "tchatDiv-top"
    const choiceTchat = choiceCss ? "tchatDiv-tchat-mini" : "tchatDiv-tchat"

    return (
        <div className={themeReducer ? choiceContainer : choiceContainer}>
            <div className={themeReducer ? `${choiceTop} tchatDiv-border-dark` : choiceTop}>
                <UserCard data={data} />
            {choiceCss ? <FontAwesomeIcon icon="times-circle" className="tchatDiv-close-icon" onClick={() => closeTchat()} /> : null}
            </div>
            <div className={themeReducer ? `${choiceTchat} tchatDiv-border-dark` : choiceTchat}>
               {load ? allMessages.map((item, key) => {
                   return <div key={key}>{item}</div>
               }) : null}
            </div>
            <div className={choiceCss ? "tchatDiv-write-dark" : "tchatDiv-write"}>
                <div className="icon-new-msg">
                    <FontAwesomeIcon icon="image" className="icon-write-new-msg"/>
                    <p className="icon-write-new-msg">GIF</p>
                </div>
                <form className="new-msg-box">
                    <button onClick={e => handleSubmit(e)} ><FontAwesomeIcon className="icon-send-msg" icon="paper-plane" /></button>
                    <textarea ref={messageRef} name="text" onChange={e => setMessage({...message, [e.target.name]: e.target.value})} className="new-msg-textarea"></textarea>
                </form>
            </div>
        </div>
    )
}
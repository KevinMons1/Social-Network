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
    const tchatRef = useRef()
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
        const id = slug === undefined ? data.userId : slug
        if (dataMessage.sender.toString() === id.toString()) {
            setAllMessages([...allMessages, dataMessage])
        }
    })
    
    useEffect(() => {
        const fetch = async () => {
            await dispatch({
                type: "CHANGE_ZINDEX",
                payload: index
            })
            // get roomId
            const dataFetchRoomId = await fetchRoomId()
            const dataRoomId = dataFetchRoomId.data.roomId
            // get message in room with roomId
            const dataFetchMessages = await fetchMessages(dataRoomId)
            const dataMessages = dataFetchMessages.data
            // not continue if haven't messages
            if (dataMessages.length > 0) {
                setAllMessages(dataMessages)
            }
            setRoomId(dataRoomId)
            // send my connection
            await socket.emit('userConnected', userDataReducer.userId)

            // Scrollbar appears at the bottom by default
            tchatRef.current.scrollTop = tchatRef.current.scrollHeight
            setLoad(true)
        }
        fetch()
    }, [roomId])

    const fetchRoomId = async () => {
        return await new Promise(resolve => {
            const id = slug === undefined ? data.userId : slug
            const dataFetch = axios.post(`http://localhost:3001/api/chat/getRoom/${id}`, {userId: userDataReducer.userId})
            resolve(dataFetch)
        })
    }

    const fetchMessages = async (id) => {
        return await new Promise(resolve => {
            const dataFetch = axios.get(`http://localhost:3001/api/chat/getMessages/${id}`)
            resolve(dataFetch)
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        setAllMessages([...allMessages, message])

        socket.emit('sendMessage', message)
        axios.post(`http://localhost:3001/api/chat/addMessage/${roomId}`, message)
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
            <div className={themeReducer ? `${choiceTchat} tchatDiv-border-dark` : choiceTchat} ref={tchatRef}>
               {load ? allMessages.map((item, key) => {
                   let isMe = item.userId === userDataReducer.userId || item.sender === userDataReducer.userId
                   return <Message key={key} data={item} isMe={isMe} />
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
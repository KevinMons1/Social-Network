import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux"
import "../../Styles/chat.css"
import {useParams} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import io from 'socket.io-client'
import imageCompression from "browser-image-compression"
import UserCard from '../Connected/UserCard'
import Message from "./Message"
import Gifs from "../Services/Gifs"

const socket = io("localhost:3001")

export default function ChatDiv({choiceCss, closeChat, data, index}) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const messageRef = useRef()
    const chatRef = useRef()
    const openFile = useRef()
    const dispatch = useDispatch()
    const { slug } = useParams()
    const [searchGif, setSearchGif] = useState("dogs")
    const [urlGif, setUrlGif] = useState("")
    const [gifVisible, setGifVisible] = useState(false)
    const [load, setLoad] = useState(false)
    const [allMessages, setAllMessages] = useState([])
    const [roomId, setRoomId] = useState(null)
    const [message, setMessage] = useState({
        text: "",
        sender: userDataReducer.userId,
        receiver: data.userId,
        type: "text"
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
            } else {
                setAllMessages([])
            }
            setRoomId(dataRoomId)
            // send my connection
            await socket.emit('userConnected', userDataReducer.userId)
            setLoad(true)
            // Scrollbar appears at the bottom by default
            setTimeout(() => {
                chatRef.current.scrollTop = chatRef.current.scrollHeight
            }, 250)
        }
        fetch()
    }, [data])

    const fetchRoomId = async () => {
        return await new Promise(resolve => {
            const id = slug === undefined ? data.userId : slug
            const dataFetch = axios.post(`http://localhost:3001/api/chat/getRoom/${id}`, {userId: userDataReducer.userId})
            resolve(dataFetch)
        })
    }

    const fetchMessages = async (id) => {
        return await new Promise(resolve => {
            const dataFetch = axios.get(`http://localhost:3001/api/chat/getContent/${id}`)
            resolve(dataFetch)
        })
    }

    const handleClickFile = () => {
        openFile.current.click()
    }

    const handleSubmitText = e => {
        e.preventDefault()
        setAllMessages([...allMessages, message])

        socket.emit('sendMessage', message)
        axios.post(`http://localhost:3001/api/chat/addMessage/${roomId}`, message)
        setMessage({...message, text: ""})
        messageRef.current.value = ""
    } 

    const handleSubmitImage = e => {
        let imageFile = e.target.files[0]
        let options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }

        imageCompression(imageFile, options)
          .then(compressedFile => {
                let formData = new FormData()
                formData.append('file', compressedFile)
                formData.append('id', userDataReducer.userId)
                axios.post(`http://localhost:3001/api/chat/addImage/${roomId}`, formData)
                    .then(res => {
                        const newImage = {
                            sender: message.sender,
                            receiver: message.receiver,
                            text: res.data,
                            type: "image"
                        }
                        socket.emit('sendMessage', newImage)
                        setAllMessages([...allMessages, newImage])
                    })
                    .catch(err => console.log(err))
          })
          .catch(error => {
            console.log(error.message)
          })
    }

    const handleSubmitGif = url => {
        const newGif = {
            sender: message.sender,
            receiver: message.receiver,
            text: url,
            type: "gif"
        }
        socket.emit('sendMessage', newGif)
        axios.post(`http://localhost:3001/api/chat/addMessage/${roomId}`, newGif)
        setAllMessages([...allMessages, newGif])
    }

    const handleVisible = () => {
        setGifVisible(!gifVisible)  
    }

    const choiceContainer = choiceCss ? "chatDiv-container-mini" : "chatDiv-container"
    const choiceTop = choiceCss ? "chatDiv-top-mini" : "chatDiv-top"
    const choicechat = choiceCss ? "chatDiv-chat-mini" : "chatDiv-chat"

    return (
        <div className={themeReducer ? choiceContainer : choiceContainer}>
            <div className={themeReducer ? `${choiceTop} chatDiv-border-dark` : choiceTop}>
                <UserCard data={data} />
            {choiceCss ? <FontAwesomeIcon icon="times-circle" className="chatDiv-close-icon" onClick={() => closeChat()} /> : null}
            </div>
            <div className={themeReducer ? `${choicechat} chatDiv-border-dark` : choicechat} ref={chatRef}>
               {load 
               ? allMessages.map((item, key) => {
                   let isMe = item.userId === userDataReducer.userId || item.sender === userDataReducer.userId
                   return <Message key={key} data={item} isMe={isMe} />
                }) 
                : null}
                {gifVisible 
                 ?   <div className="chat-searchGif">
                         <FontAwesomeIcon icon="times-circle" className="chatDiv-close-icon close-gif" onClick={() => handleVisible()} />
                         <div className="chat-gif-search-container">
                             <div className="search-top chat-gif-search">
                                 <FontAwesomeIcon className="search-icon" icon="search" />
                                 <input className="search" type="search" placeholder="Search..." onChange={e => setSearchGif(e.target.value)} />
                             </div>
                         </div>
                         <Gifs search={searchGif} handleSubmitGif={handleSubmitGif} />
                     </div>
                 :   null}
            </div>
            <div className={choiceCss ? "chatDiv-write-dark" : "chatDiv-write"}>
                <div className="icon-new-msg">
                    <input type="file" name="chatImage" id="chatImage" style={{display: "none"}} ref={openFile} onChange={e => handleSubmitImage(e)} />
                    <FontAwesomeIcon icon="image" className="icon-write-new-msg" onClick={() => handleClickFile()} />
                    <button className="icon-write-new-msg" onClick={() => handleVisible()}>GIF</button>
                </div>
                <form className="new-msg-box">
                    <button onClick={e => handleSubmitText(e)} ><FontAwesomeIcon className="icon-send-msg" icon="paper-plane" /></button>
                    <textarea ref={messageRef} name="text" onChange={e => setMessage({...message, [e.target.name]: e.target.value})} className="new-msg-textarea"></textarea>
                </form>
            </div>
        </div>
    )
}
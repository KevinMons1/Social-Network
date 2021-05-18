import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux"
import "../../Styles/chat.css"
import {useParams, useHistory} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import { useMediaQuery } from 'react-responsive'
import {socket} from "../../Api"
import imageCompression from "browser-image-compression"
import UserCard from '../Connected/UserCard'
import Message from "./Message"
import Gifs from "../Services/Gifs"

export default function ChatDiv({choiceCss, closeChat, dataClick, index, returnChat}) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
    const messageRef = useRef()
    const chatRef = useRef()
    const openFile = useRef()
    const dispatch = useDispatch()
    let { slug } = useParams()
    const history = useHistory()
    const [data, setData] = useState(null)
    const [searchGif, setSearchGif] = useState("dogs")
    const [gifVisible, setGifVisible] = useState(false)
    const [load, setLoad] = useState(false)
    const [allMessages, setAllMessages] = useState([])
    const [roomId, setRoomId] = useState(null)
    const [message, setMessage] = useState({
        text: "",
        sender: userDataReducer.userId,
        receiver: null,
        type: "text"
    })
    
    useEffect(() => {
        setLoad(false) 
        listenMessage()

        const fetch = async () => {
            await dispatch({
                type: "CHANGE_ZINDEX",
                payload: index
            })

            if (typeof dataClick === "undefined") {
                let dataFriends
                let findFriend
                let _slug

                if (parseInt(slug.split("-")[1]) !== userDataReducer.userId) return history.push("/chat/empty")
                
                _slug = slug.split("-")[0] 
                dataFriends = await fetchDataFriends()
                dataFriends = dataFriends.data
                findFriend = await dataFriends.find(element => element.userId === parseInt(_slug))

                if (typeof findFriend === "undefined") return history.push("/chat/empty")

                setData(findFriend)
                setMessage({...message, receiver: findFriend.userId})
            } else {
                setData(dataClick)
                setMessage({...message, receiver: dataClick.userId})
            }

            // get roomId
            const dataFetchRoomId = await fetchRoomId()
            const dataRoomId = dataFetchRoomId.data.roomId
            // create roomId
            if (!dataFetchRoomId.data.isNew) {
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
                await socket.emit('userConnectedOnChat', userDataReducer.userId)
                setLoad(true)
                // Scrollbar appears at the bottom by default
                scrollBottom()
            } else {
                await socket.emit('userConnectedOnChat', userDataReducer.userId)
                setRoomId(dataRoomId)
                setLoad(true)
            }
        }
        fetch()
    }, [dataClick]) // eslint-disable-line react-hooks/exhaustive-deps

    const listenMessage = () => {
         // get new message
        socket.on('newMessage', dataMessage => {
            const id = slug === undefined 
            ? data === null
                ? dataClick.userId  
                : data.userId
            : slug = slug.split("-")[0] 
            if (dataMessage.sender.toString() === id.toString()) {
                setAllMessages(allMessages => [...allMessages, dataMessage])
                scrollBottom()
            }
        })
    }

    const scrollBottom = () => {
        setTimeout(() => {
            if (chatRef.current !== null) { // Avoid a bug by spamming the responsive
                chatRef.current.scrollTop = chatRef.current.scrollHeight 
            }
        }, 250)
    }

    const fetchDataFriends = async () => {
        return await new Promise(resolve => {
            const dataFecth = axios.get(`${process.env.REACT_APP_URL}api/user/userFriends/${userDataReducer.userId}`)
            resolve(dataFecth)
        })
    }

    const fetchRoomId = async () => {
        return await new Promise(resolve => {
            const id = slug === undefined 
                ? data === null
                    ? dataClick.userId  
                    : data.userId
                : slug
            const dataFetch = axios.post(`${process.env.REACT_APP_URL}api/chat/getRoom/${id}`, {userId: userDataReducer.userId})
            resolve(dataFetch)
        })
    }

    const fetchMessages = async (id) => {
        return await new Promise(resolve => {
            const dataFetch = axios.get(`${process.env.REACT_APP_URL}api/chat/getContent/${id}`)
            resolve(dataFetch)
        })
    }

    const handleClickFile = () => {
        openFile.current.click()
    }

    const handleSubmitText = e => {
        e.preventDefault()
        if (message.text !== "") {
            setAllMessages([...allMessages, message])
            socket.emit('sendMessage', message)
            socket.emit('notificationChat', message)
            axios.post(`${process.env.REACT_APP_URL}api/chat/addMessage/${roomId}`, message)
            setMessage({...message, text: ""})
            messageRef.current.value = ""
            scrollBottom()
        }
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
                axios.post(`${process.env.REACT_APP_URL}api/chat/addImage/${roomId}`, formData)
                    .then(res => {
                        const newImage = {
                            sender: message.sender,
                            receiver: message.receiver,
                            text: res.data,
                            type: "image"
                        }
                        socket.emit('sendMessage', newImage)
                        socket.emit('notificationChat', newImage)
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
        socket.emit('notificationChat', newGif)
        axios.post(`${process.env.REACT_APP_URL}api/chat/addMessage/${roomId}`, newGif)
        setAllMessages([...allMessages, newGif])
    }

    const handleVisible = () => {
        setGifVisible(!gifVisible)  
    }

    const handleKeyDown = e => {
        if (e.repeat) return

        if (e.key === "Enter") handleSubmitText(e)
    }

    const choiceContainer = choiceCss ? "chatDiv-container-mini" : "chatDiv-container"
    const choiceTop = choiceCss ? "chatDiv-top-mini" : "chatDiv-top"
    const choicechat = choiceCss ? "chatDiv-chat-mini" : "chatDiv-chat"

    return (
        <div className={themeReducer ? choiceContainer : choiceContainer}>
            <div className={themeReducer ? `${choiceTop} chatDiv-border-dark` : choiceTop}>
                {isTabletOrMobile ? <FontAwesomeIcon icon="arrow-left" className="chatDiv-icon-arrow" onClick={() => returnChat()} /> : null}
                {load ? <UserCard noOpen={true} data={data}/> : null}
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
                             <div className="connected-search chat-gif-search">
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
                    <textarea onKeyDown={e => handleKeyDown(e)}  ref={messageRef} name="text" onChange={e => setMessage({...message, [e.target.name]: e.target.value})} className="new-msg-textarea"></textarea>
                </form>
            </div>
        </div>
    )
}
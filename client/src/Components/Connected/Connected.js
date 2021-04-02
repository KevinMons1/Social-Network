import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import {useTransition, config, animated} from "react-spring"
import {socket} from "../../Api"
import UserCard from './UserCard'
import ChatDiv from '../ChatDiv/ChatDiv'
import Notification from '../Notification/Notification'

export default function Connected({choiceCss, friendClick}) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [usersCard, setUsersCard] = useState([])
    const [usersCardChat, setUsersCardChat] = useState([])
    const [load, setLoad] = useState(false)
    const [chat, setChat] = useState(false)
    const [isAnimated, setIsAnimated] = useState(false)
    const [friendEmpty, setFriendEmpty] = useState(false)
    const [userCardClick, setUserCardClick] = useState(null)
    const [friendsConnected, setFriendsConnected] = useState([])
    const transitionContent = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "translateY(500px)", position: 'absolute'},
        enter: {opacity: 1, transform: "translateY(0)", position: "absolute"},
        leave: {opacity: 0, transform: "translateY(500px)", position: 'absolute'},
        config: config.stiff
    })

    socket.on('sendMyConnection', friendId => {
        // See if friendId is already encoding
        let isFind = friendsConnected.find(friend => friend === friendId)
        if (typeof isFind !== 'number') {
            setFriendsConnected([...friendsConnected, friendId])
            let updateUsersCard = usersCard.map(item => {
                if (item.props.data.userId === friendId) {
                    return <UserCard isConnected={true} data={item.props.data} text={false} noGreenBubble={true} open={() => handleOpenChat(item.props.data)} />
                }
                return item
            })
            setUsersCard(updateUsersCard)
        }
    })

    useEffect(() => {
        // Send userId on server for realTime components
        socket.emit('userConnected', userDataReducer.userId)

        let friends = []
        const fetchData = async () => {
            await axios.get(`http://localhost:3001/api/user/userFriends/${userDataReducer.userId}`)
            .then(res => {
                // if res.data === true but this user haven't friends
                if (res.data) {
                    res.data.forEach(friend => {
                        setUsersCard(usersCard => [...usersCard, <UserCard data={friend} text={false} open={() => handleOpenChat(friend)} />])
                        friends.push(friend.userId)
                    })         
                } else {
                    setFriendEmpty(true)
                }
            })
            .catch(err => console.log(err))
            await axios.get(`http://localhost:3001/api/user/connected/friends/chat/${userDataReducer.userId}`)
            .then(res => { 
                setFriendEmpty(true)       
                res.data.forEach(friend => {
                    if (friend != null) {
                        setUsersCardChat(usersCardChat => [...usersCardChat, <UserCard data={friend} text={true} open={() => handleOpenChat(friend)} />])      
                        setFriendEmpty(false)      
                    }
                })               
            })
            .catch(err => console.log(err))
            await socket.emit("sendMyConnection",  {
                userId: userDataReducer.userId,
                friends
            })
            setLoad(true)
            sendMyConnectionOnTime(friends)
        }
        fetchData()
    }, [])

    // To give the connection to those who connected after using it
    const sendMyConnectionOnTime = (friends) => {
        setTimeout(() => {
            socket.emit('sendMyConnection', {
                userId: userDataReducer.userId,
                friends
            }) 
            sendMyConnectionOnTime(friends)
        }, 300000);
    }

    const handleCloseChat = () => {
        setIsAnimated(false)
        setTimeout(() => {
            setChat(false)
        }, 200);
    }

    const handleOpenChat = (friendData) => {
        if (choiceCss) {
            setUserCardClick(<ChatDiv index={false} closeChat={handleCloseChat} choiceCss={true} data={friendData} />)
            setIsAnimated(true)
            setChat(true)
        } else {
            friendClick(friendData)
        }
    }

    return (
        <section className={themeReducer ? "connected-dark" : "connected"}>
            <div className="connected-title-box">
                <p className={themeReducer ? "connected-title-dark" : "connected-title"}>Connected</p>
                <Notification />
            </div>

            <div className="connected-top">
                <div className="friends-boxs">                     
                    {load 
                    ? usersCard.map((item, index) => {
                        return <div key={index}>{item}</div>
                        })   
                    : null}  
                </div>
                <div className={themeReducer.Theme ? "search-top-dark connected-search" : "search-top connected-search"}>
                    <FontAwesomeIcon className="search-icon" icon="search" />
                    <input className={themeReducer.Theme ? "search txt-dark" : "search"} type="text" placeholder="Search..."/>
                </div>
            </div>
             
             <div>
                {transitionContent.map(({item, key, props}) => item &&(
                    <animated.div className={themeReducer ? "connected-chat-dark" : "connected-chat"} key={key} style={props}>{userCardClick}</animated.div>
                ))}
                <div className="connected-bottom">
                        <div className="friends-boxs">             
                            {load 
                            ? friendEmpty 
                                ? <small>You are not friends !</small>
                                :  usersCardChat.map((item, index) => {
                                    return <div key={index}>{item}</div>
                                    }) 
                            : null}  
                        </div>  
                </div>  
             </div>
        </section>
    )
}
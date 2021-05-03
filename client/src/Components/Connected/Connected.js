import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"
import "../../Styles/Media-Queries/Laptop/connected.css"
import "../../Styles/Media-Queries/Tablet/connected.css"
import axios from "axios"
import { useMediaQuery } from 'react-responsive'
import {useTransition, config, animated} from "react-spring"
import {socket} from "../../Api"
import UserCard from './UserCard'
import ChatDiv from '../ChatDiv/ChatDiv'
import Notification from '../Notification/Notification'

export default function Connected({choiceCss, friendClick}) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
    const [load, setLoad] = useState(false)
    const [isAnimated, setIsAnimated] = useState(false)
    const [friendEmpty, setFriendEmpty] = useState(false)
    const [usersCard, setUsersCard] = useState([])
    const [usersDataChat, setUsersDataChat] = useState([])
    const [usersChatDefault, setUsersChatDefault] = useState([])
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
        if (load) {
            let newUserCard
            let isFind = friendsConnected.find(friend => friend === friendId)
            if (typeof isFind !== 'number') {
                setFriendsConnected([...friendsConnected, friendId])
                let updateUsersCard = usersCard.map((item) => {
                    if (item.data.userId === friendId) {
                        newUserCard = {
                            isConnected: true,
                            data: item.data
                        }
                        return newUserCard
                    }
                    else return item
                })
                updateUsersCard = updateUsersCard.filter(user => user.data.userId !== friendId)
                setUsersCard([newUserCard, ...updateUsersCard])
            }
        }
    })

    socket.on("notificationChat", userData => { if (load) handleClickUserChat(userData, true) })

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
                        setUsersCard(usersCard => [...usersCard, {
                            isConnected: false,
                            data: friend
                        }])
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
                        setUsersChatDefault(usersChatDefault => [...usersChatDefault, {
                            isView: false,
                            data: friend
                        }])
                        setUsersDataChat(usersDataChat => [...usersDataChat, {
                            isView: false,
                            data: friend
                        }])      
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
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    }

    const handleOpenChat = (friendData) => {
        if (choiceCss) {
            setUserCardClick(<ChatDiv index={false} closeChat={handleCloseChat} choiceCss={true} data={friendData} />)
            setIsAnimated(true)
        } else {
            friendClick(friendData)
        }
    }

    const handleClickUserChat = (userData, isServer) => {
        if (isServer) {
            if (userData.sender !== userDataReducer.userId) {
                setUsersDataChat(user => user.map(item => item.data.userId === userData.sender ? {
                        isView: true,
                        data: {
                            ...item.data,
                            text: userData.text,
                            type: userData.type
                        }
                    } : item )
                )
            }
        } else {
            setUsersDataChat(user => user.map(item => item.data.userId === userData.data.userId ? {
                    data: {...item.data},
                    isView: false
                } : item )
            )
        }
    }

    const handleChangeInput = e => {
        let isFind = false
        let name = ""
        let usersFind = []

        if (e.target.value === "") setUsersDataChat(usersChatDefault)
        else {
            usersDataChat.forEach(user => {
                name = user.data.lastName.toLowerCase() + " " + user.data.firstName.toLowerCase()
                isFind = name.includes(e.target.value.toLowerCase())
                if (isFind) usersFind.push(user)
            })
            setUsersDataChat(usersFind)
        }
        console.log(e.target.value === "")
        console.log(usersDataChat)
    }

    return isTabletOrMobile ? (
        <section className={themeReducer ? "connected-dark" : "connected"}>
            <div className="connected-top">
                <div className="friends-boxs">                     
                    {load 
                    ? usersCard.map((item, index) => {
                        return <UserCard key={index} isConnected={item.isConnected} data={item.data} text={false} open={() => handleOpenChat(item.data)} />
                        })   
                    : null}  
                </div>
                <div className="connected-search">
                    <input onChange={e => handleChangeInput(e)} className={themeReducer.Theme ? "connected-search-input txt-dark" : "connected-search-input"} type="text" placeholder="Search..."/>
                </div>
            </div>
             
             <div className="connected-bottom">
                {transitionContent.map(({item, key, props}) => item &&(
                    <animated.div className={themeReducer ? "connected-chat-dark" : "connected-chat"} key={key} style={props}>{userCardClick}</animated.div>
                ))}
                <div className="friends-boxs">             
                    {load 
                    ? friendEmpty 
                        ? <small>You are not friends !</small>
                        :  usersDataChat.map((item, index) => {
                            return  <div key={index} onClick={() => handleClickUserChat(item, false)}>
                                        <UserCard isConnected={false} isView={item.isView} data={item.data} text={true} open={() => handleOpenChat(item.data)} />
                                    </div>
                            }) 
                    : null}  
                </div>  
             </div>
        </section>
    ) : (
        <section className={themeReducer ? "connected-dark" : "connected"}>
            <div className="connected-title-box">
                <p className={themeReducer ? "connected-title-dark" : "connected-title"}>Connected</p>
                <Notification />
            </div>

            <div className="connected-top">
                <div className="friends-boxs">                     
                    {load 
                    ? usersCard.map((item, index) => {
                        return <UserCard key={index} isConnected={item.isConnected} data={item.data} text={false} open={() => handleOpenChat(item.data)} />
                        })   
                    : null}  
                </div>
                <div className="connected-search">
                    <input onChange={e => handleChangeInput(e)} className={themeReducer.Theme ? "connected-search-input txt-dark" : "connected-search-input"} type="text" placeholder="Search..."/>
                </div>
            </div>
             
             <div className="connected-bottom">
                {transitionContent.map(({item, key, props}) => item &&(
                    <animated.div className={themeReducer ? "connected-chat-dark" : "connected-chat"} key={key} style={props}>{userCardClick}</animated.div>
                ))}
                <div className="friends-boxs">             
                    {load 
                    ? friendEmpty 
                        ? <small>You are not friends !</small>
                        :  usersDataChat.map((item, index) => {
                            return  <div key={index} onClick={() => handleClickUserChat(item, false)}>
                                        <UserCard isConnected={false} isView={item.isView} data={item.data} text={true} open={() => handleOpenChat(item.data)} />
                                    </div>
                            }) 
                    : null}  
                </div>  
             </div>
        </section>
    )
}
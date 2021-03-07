import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import UserCard from './UserCard'
import TchatDiv from '../TchatDiv/TchatDiv'

export default function Connected({choiceCss, friendClick}) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [usersCard, setUsersCard] = useState([])
    const [usersCardTchat, setUsersCardTchat] = useState([])
    const [load, setLoad] = useState(false)
    const [tchat, setTchat] = useState(false)
    const [friendEmpty, setFriendEmpty] = useState(false)
    const [userCardClick, setUserCardClick] = useState(null)


    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:3001/api/user/connected/friends/${userDataReducer.userId}`)
                .then(res => {
                    // if res.data === true but this user haven't friends
                    if (res.data) {
                        res.data.forEach(friend => {
                            setUsersCard(usersCard => [...usersCard, <UserCard data={friend} text={false} open={() => handleOpenTchat(friend)} />])
                            setUsersCardTchat(usersCardTchat => [...usersCardTchat, <UserCard data={friend} text={true} open={() => handleOpenTchat(friend)} />])
                        });
                    } else {
                        setFriendEmpty(true)
                    }
                })
                .catch(err => console.log(err))
            setLoad(true)
        }
        fetchData()
    }, [])

    const handleCloseTchat = () => {
        setTchat(false)
    }

    const handleOpenTchat = (friendData) => {
        if (choiceCss) {
            setUserCardClick(<TchatDiv index={false} closeTchat={handleCloseTchat} choiceCss={true} data={friendData} />)
            setTchat(true)
        } else {
            friendClick(friendData)
        }
    }

    const usersHtml = (
        usersCard.map((item, index) => {
            return <div key={index}>{item}</div>
        })                 
    )

    const usersTchatHtml = (
        usersCardTchat.map((item, index) => {
            return <div key={index}>{item}</div>
        })                 
    )
    
    return (
        <section className={themeReducer ? "connected-dark" : "connected"}>
            <div className={themeReducer ? "connected-title-dark" : "connected-title"}>
                <p>Connected</p>
            </div>

            <div className="connected-top">
                <div className="friends-boxs">                     
                    {load 
                    ? friendEmpty 
                        ? <small>You are not friends !</small>
                        : usersHtml
                    : null}  
                </div>
                <div className={themeReducer.Theme ? "search-top-dark connected-search" : "search-top connected-search"}>
                    <FontAwesomeIcon className="search-icon" icon="search" />
                    <input className={themeReducer.Theme ? "search txt-dark" : "search"} type="text" placeholder="Search..."/>
                </div>
            </div>

            {tchat 
            ? userCardClick 
            :   <div className="connected-bottom">
                    <div className="friends-boxs">             
                        {load 
                        ? friendEmpty 
                            ? <small>You are not friends !</small>
                            : usersTchatHtml
                        : null}  
                    </div>  
                </div>  
            }
        </section>
    )
}
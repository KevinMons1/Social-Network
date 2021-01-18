import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import UserCard from './UserCard'
import TchatDiv from '../TchatDiv/TchatDiv'

export default function Connected(props) {

    const [usersCard, setUsersCard] = useState([])
    const [usersCardTchat, setUsersCardTchat] = useState([])
    const [load, setLoad] = useState(false)
    const [tchat, setTchat] = useState(false)
    const themeReducer = useSelector(state => state)

    useEffect(() => {
        for (let i = 0; i < 10; i++) {
            setUsersCard(usersCard => [...usersCard, <UserCard text={false} open={props.choiceCss ? handleOpenTchat : null} />])
            setUsersCardTchat(usersCardTchat => [...usersCardTchat, <UserCard text={true} open={props.choiceCss ? handleOpenTchat : null} />])
        }
        setLoad(true)
    }, [])

    const handleCloseTchat = () => {
        setTchat(false)
    }

    const handleOpenTchat = () => {
        setTchat(true)
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
        <section className={themeReducer.Theme ? "connected-dark" : "connected"}>
            <div className={themeReducer.Theme ? "connected-title-dark" : "connected-title"}>
                <p>Connected</p>
            </div>

            <div className="connected-top">
                <div className="friends-boxs">                     
                    {load ? usersHtml : <p>...</p>}
                </div>
                <div className={themeReducer.Theme ? "search-top-dark connected-search" : "search-top connected-search"}>
                    <FontAwesomeIcon className="search-icon" icon="search" />
                    <input className={themeReducer.Theme ? "search txt-dark" : "search"} type="text" placeholder="Search..."/>
                </div>
            </div>

            {tchat ? <TchatDiv closeTchat={handleCloseTchat} choiceCss={true} /> :
                <div className="connected-bottom">
                    <div className="friends-boxs">             
                        {load ? usersTchatHtml : <p>...</p>}  
                    </div>  
                </div>  
            }
        </section>
    )
}
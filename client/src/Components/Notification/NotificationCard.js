import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import {useHistory} from "react-router-dom"
import UserCard from '../Connected/UserCard'
import moment from "moment"
import axios from "axios"

export default function NotificationCard({ data }) {

    const themeReducer = useSelector(state => state.Theme)
    const history = useHistory()
    const [message, setMessage] = useState("")
    const [load, setLoad] = useState(false)
    const [isView, setIsView] = useState(true)

    useEffect(() => {
        setIsView(data.content.view)
        switch (data.content.type) {
            case "like":
                setMessage(`To liked your post !`)
                break;
        
            case "comment":
                setMessage(`To commented your post !`)
                break;

            case "invitation":
                setMessage(`To sent you a friend invitation !`)
                break;
                
            default:
                break;
        }
        setLoad(true)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleClickInvitation = async choice => {
        if (choice) {
            await axios.post(`${process.env.REACT_APP_URL}api/user/friend/add/${data.content.senderId}`, {
                userId: data.content.receiverId 
            })
            .then()
            .catch(err => console.log(err))
        } 
        setLoad(false)
        await axios.delete(`${process.env.REACT_APP_URL}api/notifications/delete`, {data: {
            type: "invitation",
            receiverId: data.content.receiverId,
            senderId: data.content.senderId,
            date: data.content.date
        }})
    }

    const handleOpen = (userId) => {
        history.push(`/account/${userId}`)
    }

    const messageStyle = themeReducer ? " notification-msg-dark " : " notification-msg "
    
    return ( load ?
        <div className="notification-element">
            <small className={themeReducer ? "notification-time txt-dark" : "notification-time"}>{moment(new Date(data.content.date)).fromNow()}</small>
            <div className="notification-user">
                <UserCard open={() => handleOpen(data.user.userId)} data={data.user} />   
            </div>
            <div className="notification-alert">
                <p className={isView ? messageStyle : messageStyle + "noView" }>{message}</p>
               {isView ? null : <div className="notification-new"></div>}
            </div>
           {data.content.type === "invitation" 
           ? <div className="notification-invitation">
                <button onClick={() => handleClickInvitation(true)} className="notification-btn notification-btn-accept">Accept</button>
                <button onClick={() => handleClickInvitation(false)} className="notification-btn notification-btn-refuse">Refuse</button>
            </div>            
            : null}
        </div>
    : null)
}

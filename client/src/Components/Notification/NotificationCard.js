import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import UserCard from '../Connected/UserCard'
import moment from "moment"
import axios from "axios"

export default function NotificationCard({isView, data}) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [message, setMessage] = useState("")
    const [load, setLoad] = useState(false)
    const [isChoice, setIsChoice] = useState(false)

    useEffect(() => {
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
    }, [])

    const handleClickInvitation = choice => {
        if (choice) {
            axios.post(`http://localhost:3001/api/user/account/friend/add/${data.user.userId}`, {userId: userDataReducer.userId})
                .then(res => {
                    setIsChoice(true)
                })
                .catch(err => console.log(err))
        } else setLoad(false)
    }

    const messageStyle = themeReducer ? " notification-msg-dark " : " notification-msg "
    
    return ( load ?
        <div className="notification-element">
            <small className={themeReducer ? "notification-time txt-dark" : "notification-time"}>{moment(Date.now()).fromNow()}</small>
            <div className="notification-user">
                <UserCard data={data.user} />   
            </div>
            <div className="notification-alert">
                <p className={isView ? messageStyle : messageStyle + "noView" }>{message}</p>
                <div className="notification-new"></div>
            </div>
           {data.content.type === "invitation" 
           ? (!isChoice) 
                ?   <div className="notification-invitation">
                        <button onClick={() => handleClickInvitation(true)} className="notification-btn notification-btn-accept">Accept</button>
                        <button onClick={() => handleClickInvitation(false)} className="notification-btn notification-btn-refuse">Refuse</button>
                    </div>       
                : null    
            : null}
        </div>
    : null)
}

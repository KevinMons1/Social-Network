import React, {useState} from 'react'
import "../../Styles/services.css"
import {useSelector} from "react-redux"
import {useHistory} from "react-router-dom"
import {socket} from "../../Api"
import axios from "axios"

export default function SuggestFriendCard({ data }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [waiting, setWaiting] = useState(false)
    const history = useHistory()

    const handleClick = () => {
        history.push(`/account/${data.userId}`)
    }

    const handleAddFriend = () => {
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        
        setWaiting(true)
        axios.post(`${process.env.REACT_APP_URL}api/notifications/add`, {
            receiver : data.userId,
            sender: userDataReducer.userId,
            type: "invitation",
            date: dateTime
        })
        socket.emit("notification", {
            receiver: data.userId,
            sender: {
                user: {
                    firstName: userDataReducer.firstName,
                    lastName: userDataReducer.lastName,
                    profileImage: userDataReducer.profileImage,
                    userId: userDataReducer.userId
                },
                content: {
                    receiverId: data.userId,
                    senderId: userDataReducer.userId,
                    type: "invitation",
                    date: dateTime,
                    view: 0,
                }
            }
        })
    }

    return (
        <div className={themeReducer ? "suggestFriendCard-dark" : "suggestFriendCard"}>
            <div className="suggestFriendCard-top">
                <img src={data.profileImage} alt="Frame profile" onClick={() => handleClick()} />
            </div>
            <div className="suggestFriendCard-bottom">
                <p className={themeReducer ? "txt-dark" : null} onClick={() => handleClick()}>{data.lastName} {data.firstName}</p>
                <button className={themeReducer ? "suggestFriendCard-btn-dark" : "suggestFriendCard-btn"}>
                    {waiting 
                    ?   <p className={themeReducer ? "suggestFriendCard-btn-dark" : "suggestFriendCard-btn"}>Waiting...</p>
                    :   <p className={themeReducer ? "suggestFriendCard-btn-dark" : "suggestFriendCard-btn"} onClick={() => handleAddFriend()}>Add friend</p>     
                    }
                </button>
            </div>
        </div>
    )
}




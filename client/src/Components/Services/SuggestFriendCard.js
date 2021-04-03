import React, {useState} from 'react'
import "../../Styles/services.css"
import {useSelector} from "react-redux"
import {useHistory} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
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
        setWaiting(true)
        axios.post("http://localhost:3001/api/notifications/add", {
            receiver : data.userId,
            sender: userDataReducer.userId,
            type: "invitation"
        })
        socket.emit("notification", {
            receiver: data.userId,
            sender: {
                user: userDataReducer,
                content: {
                    type: "invitation"
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




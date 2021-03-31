import React, {useState} from 'react'
import "../../Styles/services.css"
import {useSelector} from "react-redux"
import {useHistory} from "react-router-dom"
import axios from "axios"

export default function SuggestFriendCard({ data }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const history = useHistory()
    const [isFriend, setIsFriend] = useState(false)

    const handleClick = () => {
        history.push(`/account/${data.userId}`)
    }

    const handleAddFriend = () => {
        axios.post(`http://localhost:3001/api/user/account/friend/add/${data.userId}`, {userId: userDataReducer.userId})
            .then(res => {
                setIsFriend(true)
            })
            .catch(err => console.log(err))
    }

    const handleDelete = () => {
        axios.post(`http://localhost:3001/api/user/account/friend/delete/${data.userId}`, {userId: userDataReducer.userId})
            .then(res => {
                setIsFriend(false)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className={themeReducer ? "suggestFriendCard-dark" : "suggestFriendCard"}>
            <div className="suggestFriendCard-top">
                <img src={data.profileImage} alt="Frame profile" onClick={() => handleClick()} />
            </div>
            <div className="suggestFriendCard-bottom">
                <p className={themeReducer ? "txt-dark" : null} onClick={() => handleClick()}>{data.lastName} {data.firstName}</p>
                <button className={themeReducer ? "suggestFriendCard-btn-dark" : "suggestFriendCard-btn"}>
                    {isFriend
                    ? <p className={themeReducer ? "suggestFriendCard-btn-dark" : "suggestFriendCard-btn"} onClick={() => handleDelete()}>Friend</p>
                    : <p className={themeReducer ? "suggestFriendCard-btn-dark" : "suggestFriendCard-btn"} onClick={() => handleAddFriend()}>Add friend</p>
                    }
                </button>
            </div>
        </div>
    )
}


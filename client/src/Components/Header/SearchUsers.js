import React from 'react'
import { useHistory } from 'react-router-dom'
import UserCard from "../Connected/UserCard"

export default function SearchUsers({ data }) {

    const history = useHistory()

    const handleClick = user => {
        history.push(`/account/${user.userId}`)
    }

    return (
        <div className="searchUsers">
           {data.map((item, index) => {
                return (
                    <div key={index} onClick={() => handleClick(item)}>
                        <UserCard noOpen={true} data={item} />
                    </div>
                )
            })}
        </div>
    )
}

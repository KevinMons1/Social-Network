import React, {useState} from 'react'
import "../../Styles/Media-Queries/Tablet/account.css"
import { useTransition, animated, config } from "react-spring"
import {useSelector} from "react-redux"
import axios from "axios"

export default function RemoveFriend({ setClose, friendId }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [isAnimated, setIsAnimated] = useState(true)
    const transitionContent = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "scale(0)"},
        enter: {opacity: 1, transform: "scale(1)"},
        leave: {opacity: 0, transform: "scale(0)"},
        config: config.stiff
    })
    const transitionContentOpacity = useTransition(isAnimated, null, {
        from: {opacity: 0},
        enter: {opacity: 0.5},
        leave: {opacity: 0},
        config: config.stiff
    })

    const handleDelete = () => {
        axios.delete(`http://localhost:3001/api/user/account/friend/delete/${friendId}`, {data: {userId: userDataReducer.userId}})
            .then(res => {
                if (res.data.alert) handleCloseRemoveFriend(false)
            })
            .catch(err => console.log(err))
    }

    const handleCloseRemoveFriend = (choice) => {
        setIsAnimated(!isAnimated)
        setTimeout(() => {
            setClose(choice)
        }, 200);
    }

    return (
        <div>
            {transitionContentOpacity.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className="account-modify-opacity"></animated.div>
            ))}
            {transitionContent.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className={themeReducer ? "account-remove-friend-content-dark" : "account-remove-friend-content"}>
                    <p className={themeReducer ? "txt-dark" : null}>You are sure to delete this friend ?</p>
                    <div>
                        <button className="deleteMsg-btn delBtn1" onClick={() => handleDelete()}>DELETE</button>
                        <button className="deleteMsg-btn delBtn2" onClick={() => handleCloseRemoveFriend(true)}>CANCEL</button>
                    </div>
            </animated.div>
            ))}
        </div>
    )
}

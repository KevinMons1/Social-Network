import React, {useState, useEffect} from 'react'
import {useLocation, useHistory} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import UserCard from "../Connected/UserCard"

export default function MainFriends() {

    const themeReducer = useSelector(state => state.Theme)
    const location = useLocation()
    const history = useHistory()
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => { 
        // Get informations for account
        let path, idPath
        setLoad(false)
        setIsEmpty(true)
        
        dispatch({
            type: "CHANGE_ZINDEX",
            payload: false
        })

        // Get userId
        path = location.pathname
        idPath = path.substr(9)
        idPath = idPath.split('/')

        const fetchDataAccount = async () => {
                await axios.get(`http://localhost:3001/api/user/userFriends/${idPath[0]}`)
                    .then(res => {
                        if (res.data.length === 0) {
                        } else {
                            setIsEmpty(false)
                            setData(res.data)
                        }
                    })
                    .catch(err => console.log(err))
                }
                fetchDataAccount()
                setLoad(true)
        }, [location])

    const handleClickFriend = (friend) => {
        history.push(`/account/${friend.userId}`)
    }

    const handleClickBack = () => {
        let path = location.pathname
        let lastPath = path.split('/friends')
        history.push(lastPath[0])
    }

    return ( load ?
        <div className={themeReducer ? "mainFriends-dark" : "mainFriends"}>
            <FontAwesomeIcon onClick={() => handleClickBack()} icon="arrow-left" className={themeReducer ? "txt-dark friends-icon" : "friends-icon"}/>
            <div className="friends-container">
                <h2 className={themeReducer ? "txt-dark" : null}>Friends</h2>
                <div className="friends-content">
                {isEmpty 
                    ?   <p className="friends-empty">This user does not have friends ...</p>
                    :   data.map((item, index) => {
                        return (
                            <div className="friend-card" key={index} index={index} onClick={() => handleClickFriend(item)}>
                                <UserCard tallCard={true}  noOpen={true} data={item} />   
                            </div>
                        )})
                    }
                </div>
            </div>
        </div>

    : <div className={themeReducer ? "mainFriends-dark" : "mainFriends"}></div>)
}

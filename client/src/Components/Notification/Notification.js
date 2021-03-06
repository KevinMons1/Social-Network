import React, {useEffect, useState} from 'react'
import "../../Styles/notifcation.css"
import "../../Styles/Media-Queries/Laptop/notification.css"
import "../../Styles/Media-Queries/MobileL/notification.css"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import {useTransition, config, animated} from "react-spring"
import {socket} from "../../Api"
import axios from "axios"
import NotificationCard from "./NotificationCard"

export default function Notification({ choiceCss }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [load, setLoad] = useState(false)
    const [isAnimated, setIsAnimated] = useState(false)
    const transitionContent = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "translateY(-300px)", position: 'absolute'},
        enter: {opacity: 1, transform: "translateY(0)", position: "absolute"},
        leave: {opacity: 0, transform: "translateY(-300px)", position: 'absolute'},
        config: config.stiff
    })

    useEffect(() => {
        setLoad(false)
        listenNotification()
        const fetch = async () => {
            await axios.get(`${process.env.REACT_APP_URL}api/notifications/all/${userDataReducer.userId}`)
                .then(res => {
                    if (res.data.length > 0) {
                        let _count = 0
                        res.data.forEach(notif => {
                            if (notif.content.view === 0) _count++
                        })
                        setCount(count + _count)
                        setData(res.data)
                    }
                })
                .catch(err => console.log(err))
            setLoad(true)
        }
        fetch()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const listenNotification = () => {
        socket.on("notification", userData => {
            if (userData.user.userId !== userDataReducer.userId) {
                setData(item => [userData, ...item])
                setCount(count => count + 1)
            }
        })
    }

    const handleClickHide = () => {
        let changeData = []
        setIsAnimated(!isAnimated)
        setCount(0)

        if (data.length > 0) {
            data.forEach(element => {
                if (element.content.view === 0) changeData.push(element.content)
            }) 
        }

        axios.put(`${process.env.REACT_APP_URL}api/notifications/view/update`, changeData)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div className="notification">
            <div className={choiceCss ? "notification-icon-box-chat" : "notification-icon-box"} onClick={() => handleClickHide()}>
                <FontAwesomeIcon className={choiceCss ? themeReducer ? "notification-icon-dark-chat" : "notification-icon-chat" : themeReducer ? "notification-icon-dark" : "notification-icon"} icon="bell"/>
                {count > 0 ? <div className={choiceCss ? "notification-icon-number-chat" : "notification-icon-number"}>{count}</div> : null}
            </div>

            {transitionContent.map(({item, key, props}) => item &&(
                <animated.div className={themeReducer ? "notification-card-dark" : "notification-card"} key={key} style={props}>
                    <div className="notification-top">
                        <p className={themeReducer ? "txt-dark" : null}>Notifications</p>
                        <FontAwesomeIcon icon="times-circle" className="notification-close-icon" onClick={() => handleClickHide()} />
                    </div>
                   {load 
                   ? data.map((item, index) => {
                        return <NotificationCard isView={false} data={item} key={index} />
                    })
                   : null
                    }
                </animated.div>
            ))}
    </div>
    )
}

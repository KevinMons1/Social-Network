import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import {useTransition, animated} from "react-spring"
import UserCard from "../Connected/UserCard"

export default function SearchUsers({ data, isSearch }) {

    const history = useHistory()
    const [isAnimated, setIsAnimated] = useState(true)
    const transitionContent = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "translateX(-200px)"},
        enter: {opacity: 1, transform: "translateX(0)"},
        leave: {opacity: 0, transform: "translateX(-200px)"}
    })

    useEffect(() => {
        if (isSearch) setIsAnimated(true)
        else setIsAnimated(false)
    }, [isSearch])

    const handleClick = user => {
        history.push(`/account/${user.userId}`)
    }

    return (
        <div>
            {transitionContent.map(({item, key, props}) => item && (
                <animated.div className="searchUsers" key={key} style={props}>
                    {isSearch
                    ? data.map((item, index) => {
                        return (
                            <div key={index} onClick={() => handleClick(item)}>
                                <UserCard noOpen={true} data={item} />
                            </div>
                        )
                        })
                    : null}
                </animated.div>
            ))}
        </div>
    )
}

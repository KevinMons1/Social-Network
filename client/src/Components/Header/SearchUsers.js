import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux"
import { useMediaQuery } from 'react-responsive'
import {useTransition, animated} from "react-spring"
import UserCard from "../Connected/UserCard"

export default function SearchUsers({ data, isSearch, setIsSearch }) {

    const history = useHistory()
    const themeReducer = useSelector(state => state.Theme)
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
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
        if (isTabletOrMobile) setIsSearch()
        history.push(`/account/${user.userId}`)
    }

    return (
        <div>
            {transitionContent.map(({item, key, props}) => item && (
                <animated.div className={themeReducer ? "searchUsers-dark" : "searchUsers"} key={key} style={props}>
                    {isSearch
                    ? data.map((item, index) => {
                        return (
                            <div key={index} onClick={() => handleClick(item)}>
                                <UserCard tallCard={isTabletOrMobile ? true : false} noOpen={true} data={item} />
                            </div>
                        )
                        })
                    : null}
                </animated.div>
            ))}
        </div>
    )
}

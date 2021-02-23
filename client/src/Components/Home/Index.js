import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/home.css"

//Components
import MainHome from "./MainHome"

export default function Index() {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={themeReducer ? "home-dark" : "home"}>
            <MainHome />
        </div>
    )
}

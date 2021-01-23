import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/home.css"

//Components
import Header from "../Header/Header"
import MainHome from "./MainHome"
import Connected from "../Connected/Connected"

export default function Index() {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={themeReducer ? "home-dark" : "home"}>
            <Header />
            <MainHome />
            <Connected choiceCss={true} />
        </div>
    )
}

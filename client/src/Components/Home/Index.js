import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/home.css"

//Components
import Header from "../Header/Header"
import MainHome from "./MainHome"
import Connected from "../Connected/Connected"

export default function Index() {

    const themeReducer = useSelector(state => state)

    return (
        <div className={themeReducer.Theme ? "home-dark" : "home"}>
            <Header />
            <MainHome />
            <Connected choiceCss={true} />
        </div>
    )
}

import React from 'react'
import {useSelector} from "react-redux"
import {withRouter} from "react-router-dom"
import "../../Styles/home.css"
import {Helmet} from "react-helmet"

//Components
import MainHome from "./MainHome"

export default withRouter(function Index({ isHome }) {

    const themeReducer = useSelector(state => state.Theme)
    
    return (
        <section className={themeReducer ? "home-dark" : "home"}>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <MainHome isHome={isHome} />
        </section>
    )
})


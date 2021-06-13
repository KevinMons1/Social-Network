import React from 'react'
import {withRouter} from "react-router-dom"
import "../../Styles/friends.css"
import {Helmet} from "react-helmet"

import MainFriends from "./MainFriends"

export default withRouter(function Index() {
    return (
        <section className="friends">
             <Helmet>
                <title>Friends list</title>
            </Helmet>
            <MainFriends />
        </section>
    )
})

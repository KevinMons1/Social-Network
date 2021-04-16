import React from 'react'
import {withRouter} from "react-router-dom"
import "../../Styles/friends.css"

import MainFriends from "./MainFriends"

export default withRouter(function Index() {
    return (
        <section className="friends">
            <MainFriends />
        </section>
    )
})

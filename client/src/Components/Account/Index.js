import React from 'react'
import {withRouter} from "react-router-dom"
import "../../Styles/gaming.css"

// Components
import MainAccount from "./MainAccount"

export default withRouter(function Index() {
    return (
        <section className="account">
            <MainAccount />
        </section>
    )
})

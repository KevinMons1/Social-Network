import React from 'react'
import {withRouter} from "react-router-dom"
import {Helmet} from "react-helmet"

// Components
import MainGaming from "./MainGaming"

export default withRouter(function Index() {
    return (
        <section className="gaming">
            <Helmet>
                <title>Gaming</title>
            </Helmet>
            <MainGaming />
        </section>
    )
})

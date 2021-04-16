import React from 'react'
import {withRouter} from "react-router-dom"

// Components
import MainGaming from "./MainGaming"

export default withRouter(function Index() {
    return (
        <section className="gaming">
            <MainGaming />
        </section>
    )
})

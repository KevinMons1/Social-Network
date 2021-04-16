import React from 'react'
import "../../Styles/publication.css"
import {withRouter} from "react-router-dom"

import MainPublication from "./MainPublication"

export default withRouter(function Index() {
    return (
        <section className="publication">
            <MainPublication />
        </section>
    )
})

import React, {useState} from 'react'
import {withRouter} from "react-router-dom"
import "../../Styles/gaming.css"
import {Helmet} from "react-helmet"

// Components
import MainAccount from "./MainAccount"

export default withRouter(function Index() {

    const [titlePage, setTitlePage] = useState("Account")

    const changeTitle = name => {
        setTitlePage("Account - " + name)
    }

    return (
        <section className="account">
            <Helmet>
                <title>{titlePage}</title>
            </Helmet>
            <MainAccount changeTitle={(name) => changeTitle(name)} />
        </section>
    )
})

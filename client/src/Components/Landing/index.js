import React from 'react'
import "../../Styles/landing.css"
import "../../Styles/Media-Queries/Tablet/landing.css"
import "../../Styles/Media-Queries/MobileL/landing.css"
import Landing from "./Landing"
import {Helmet} from "react-helmet"

export default function index() {
    return (
        <section className="landing">
            <Helmet>
                <title>Landing</title>
            </Helmet>
            <Landing />
        </section>
    )
}

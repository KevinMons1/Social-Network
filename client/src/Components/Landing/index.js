import React from 'react'
import "../../Styles/landing.css"
import "../../Styles/Media-Queries/Tablet/landing.css"
import "../../Styles/Media-Queries/MobileL/landing.css"
import Landing from "./Landing"

export default function index() {
    return (
        <section className="landing">
            <Landing />
        </section>
    )
}

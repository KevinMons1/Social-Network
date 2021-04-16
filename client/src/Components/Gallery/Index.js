import React from 'react'
import {withRouter} from "react-router-dom"
import "../../Styles/gallery.css"

import MainGallery from "./MainGallery"

export default withRouter(function Index() {
    return (
        <section className="gallery">
            <MainGallery />
        </section>
    )
})

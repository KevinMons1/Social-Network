import React from 'react'
import {withRouter} from "react-router-dom"
import "../../Styles/gallery.css"
import {Helmet} from "react-helmet"

import MainGallery from "./MainGallery"

export default withRouter(function Index() {
    return (
        <section className="gallery">
            <Helmet>
                <title>Gallery</title>
            </Helmet>
            <MainGallery />
        </section>
    )
})

import React from 'react'
import "./../../Styles/services.css"
import {withRouter, Link} from "react-router-dom"
import ErrorGif from "../../Assets/Images/error.gif"

export default withRouter(function Error() {
    return (
        <section className="error">
            <img src={ErrorGif} alt="Error 404 page not found"/>
            <div className="error-txt">
                <h1>Error 404, page not found !</h1>
                <button className="error-btn">
                    <Link className="error-btn-link" to="/" >Go to back</Link>
                </button>
            </div>
        </section>
    )
})

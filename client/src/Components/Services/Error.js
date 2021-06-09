import React from 'react'
import "./../../Styles/services.css"
import {withRouter, Link} from "react-router-dom"
import {useSelector} from "react-redux"
import ErrorGif from "../../Assets/Images/error.gif"
import ErrorGifDark from "../../Assets/Images/error-dark.json"
import Lottie from "react-lottie"

export default withRouter(function Error() {
    const themeReducer = useSelector(state => state.Theme)
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: ErrorGifDark,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }
    
    return (
        <section className={themeReducer ? "error-dark" : "error"}>
            {themeReducer 
            ? <Lottie options={defaultOptions} height={400} width={400}/>
            : <img src={ErrorGif} alt="Error 404 page not found"/>
            } 
            <div className="error-txt">
                <h1>Error 404, page not found !</h1>
                <button className="error-btn">
                    <Link className="error-btn-link" to="/" >Go to back</Link>
                </button>
            </div>
        </section>
    )
})

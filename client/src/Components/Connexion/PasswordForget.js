import React, {useState} from 'react'
import {Link} from "react-router-dom"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"
import AnimPageConnexionDark from "../../Assets/Images/anim-page-connexion-dark.json"
import {useSelector} from "react-redux"
import Lottie from "react-lottie"

export default function PasswordForget() {
    const themeReducer = useSelector(state => state.Theme)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [data, setData] = useState("")
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: AnimPageConnexionDark,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }

    const handleChange = e => {
    setData(e.target.value)
    }

    const handleSubmit = e => {

    }

    return (
        <section className={themeReducer ? "connexion-dark" : "connexion"}>
            <div className={themeReducer ? "connexion-left-dark" : "connexion-left"}>
                <div className={themeReducer ? "connexion-title-dark" : "connexion-title"}>
                    <h1>Password Forget</h1>
                    {alertMsg === "" 
                    ?   null 
                    :   <div className={alertCss ? "alert-danger" : "alert-none"}>
                            <p>{alertMsg}</p>
                        </div>
                    }
                </div>
                <form className="connexion-form" onSubmit={e => handleSubmit(e)}>
                    <div className="connexion-info">
                        <label onChange={e => handleChange(e)} htmlFor="email" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Mail address</label>
                        <input type="email" name="email" className="connexion-input"/>
                    </div>
                    <div className="connexion-submit">
                        <button type="submit"className={themeReducer ? "connexion-btn-dark" : "connexion-btn"}>SIGN IN</button>
                    </div>
                </form>
                <div className="connexion-link-box">
                    <Link to="/login" className={themeReducer ? "connexion-link-dark" : "connexion-link"}>Login</Link>
                </div>
            </div>

            <div className="connexion-right">
                {themeReducer 
                ? <Lottie options={defaultOptions} height={400} width={400}/>
                : <img src={AnimPageConnexion} alt="Error 404 page not found"/>
                } 
            </div>
        </section>
    )
}

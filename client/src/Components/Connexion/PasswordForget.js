import React, {useState, useRef} from 'react'
import {Link} from "react-router-dom"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"
import AnimPageConnexionDark from "../../Assets/Images/anim-page-connexion-dark.json"
import {useSelector} from "react-redux"
import Lottie from "react-lottie"
import axios from "axios"

export default function PasswordForget() {

    const themeReducer = useSelector(state => state.Theme)
    const emailRef = useRef()
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [data, setData] = useState({email: ""})
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: AnimPageConnexionDark,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }

    const handleChange = e => {
        setData({email: e.target.value})
    }

    const verifyEmail = () => {
        if (data.email.length > 4) {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(data.email)
        } else return false
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (verifyEmail()) {
            axios.post(`${process.env.REACT_APP_URL}api/auth/password-forget`, data)
                .then(res => {
                    setAletCss(res.data.alert)
                    setAlertMsg(res.data.message)
                    setData("")
                    emailRef.current.value = ""
                })
                .catch(err => console.log(err))
        } else {
            setAletCss(true)
            setAlertMsg("Mail address not valid !")
        }
    }

    return (
        <section className={themeReducer ? "connexion-dark" : "connexion"}>
            <div className={themeReducer ? "connexion-left-dark" : "connexion-left"}>
                <div className={themeReducer ? "connexion-title-dark" : "connexion-title"}>
                    <h1>Password Forget</h1>
                </div>
                    {alertMsg === "" 
                    ?   null 
                    :   <div className={alertCss ? "alert-danger" : "alert-success"}>
                            <p>{alertMsg}</p>
                        </div>
                    }
                <form className="connexion-form" onSubmit={e => handleSubmit(e)}>
                    <div className="connexion-info">
                        <label htmlFor="email" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Mail address</label>
                        <input onChange={e => handleChange(e)} ref={emailRef} type="email" name="email" className="connexion-input"/>
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

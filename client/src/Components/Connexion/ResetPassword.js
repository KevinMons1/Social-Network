import React, {useState, useRef} from 'react'
import {Link, useParams, useHistory} from "react-router-dom"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"
import AnimPageConnexionDark from "../../Assets/Images/anim-page-connexion-dark.json"
import {useSelector} from "react-redux"
import Lottie from "react-lottie"
import axios from "axios"

export default function ResetPassword() {

    const themeReducer = useSelector(state => state.Theme)
    const passwordRef = useRef()
    const history = useHistory()
    const params = useParams()
    const passwordVerifRef = useRef()
    const [passwordVerify, setPasswordVerify] = useState("")
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

    const verifyPassword = () => {
        if (data.length >= 6) {
            if (data === passwordVerify) {
                return true
            } else {
                setAletCss(true)
                setAlertMsg("Your passwords do not match !")
                return false
            }
        } else {
            setAletCss(true)
            setAlertMsg("Your password must contain at least 6 characters !")
            return false
        }
    }

    const verifyEmail = (email) => {
        if (email.length > 4) {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(email)
        } else return false
    }

    const handleSubmit = e => {
        e.preventDefault()
        
        const slug = params.slug
        const email = slug.split("_")[0]
        const token = slug.split("_")[1]

        if (verifyEmail(email)) {
            if (verifyPassword()) {
                axios.post(`${process.env.REACT_APP_URL}api/auth/reset-password`, {
                    password: data,
                    email: email,
                    token: token
                })
                .then(res => {
                    setAletCss(res.data.alert)
                    setAlertMsg(res.data.message)
                    setData("")
                    passwordRef.current.value = ""
                    passwordVerifRef.current.value = ""
                    setTimeout(() => {
                        history.push({pathname: '/login'})
                    }, 1500)
                })
                .catch(err => console.log(err))
            }
        } else {
            setAletCss(true)
            setAlertMsg("Url not valid, you will be redirected !")
            setTimeout(() => {
                history.push({pathname: '/login'})
            }, 2000)  
        }

    }

     return (
        <section className={themeReducer ? "connexion-dark" : "connexion"}>
            <div className={themeReducer ? "connexion-left-dark" : "connexion-left"}>
                <div className={themeReducer ? "connexion-title-dark" : "connexion-title"}>
                    <h1>Reset Password</h1>
                </div>
                    {alertMsg === "" 
                    ?   null 
                    :   <div className={alertCss ? "alert-danger" : "alert-success"}>
                            <p>{alertMsg}</p>
                        </div>
                    }
                <form className="connexion-form" onSubmit={e => handleSubmit(e)}>
                    <div className="connexion-info">
                        <label htmlFor="password" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>New password</label>
                        <input onChange={e => handleChange(e)} ref={passwordRef} type="password" name="password" className="connexion-input" required/>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="passwordVerif" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Verify Password</label>
                        <input onChange={e => setPasswordVerify(e.target.value)} ref={passwordVerifRef} required type="password" name="passwordVerif" className="connexion-input" />
                    </div>
                    <div className="connexion-submit">
                        <button type="submit"className={themeReducer ? "connexion-btn-dark" : "connexion-btn"}>CHANGE PASSWORD</button>
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

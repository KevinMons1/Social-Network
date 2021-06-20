import React, {useState} from 'react'
import {Link, useHistory} from "react-router-dom"
import axios from "axios"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"
import AnimPageConnexionDark from "../../Assets/Images/anim-page-connexion-dark.json"
import {useSelector} from "react-redux"
import Lottie from "react-lottie"
import GoogleLogin from 'react-google-login';
import {Helmet} from "react-helmet"

export default function Signup() {

    const themeReducer = useSelector(state => state.Theme)
    const history = useHistory()
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [passwordVerify, setPasswordVerify] = useState("")
    const [data, setData] = useState({
        lastName: "",
        firstName: "",
        email: "",
        password: ""
    })
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: AnimPageConnexionDark,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }

    const verifyInformations = () => {
        const regex = /^[^@&":()!_$*€<>£`'µ§%+=;?#]+$/
        let lastName = data.lastName
        let firstName = data.firstName

        if (firstName.length > 2 && lastName.length > 2) {
            if (firstName.match(regex) && lastName.match(regex)) {
                if (data.password.length >= 6) {
                    if (data.password === passwordVerify) {
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
            } else {
                setAletCss(true)
                setAlertMsg("Do not use special characters for your lastName and firstName !")
                return false
            }
        } else {
            setAletCss(true)
            setAlertMsg("Your first and last name must contain more than 2 characters!")
            return false
        }
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (verifyInformations()) {
            axios.post(`${process.env.REACT_APP_URL}api/auth/signup`, data)
                .then(res => {
                    setAletCss(res.data.alert)
                    setAlertMsg(res.data.message)
                    if (!res.data.alert) {
                        setTimeout(() => {
                            history.push({pathname: '/login'})
                        }, 1500)
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const responseSuccessGoogle = (response) => {
        axios.post(`${process.env.REACT_APP_URL}api/auth/signup-google`, {tokenId: response.tokenId})
        .then(res => {
            setAletCss(res.data.alert)
            setAlertMsg(res.data.message)
            if (!res.data.alert) {
                setTimeout(() => {
                    history.push({pathname: '/login'})
                }, 1500)
            }
        })
        .catch(err => console.log(err))
      }

    const responseErrorGoogle = (response) => {
        setAletCss(true)
        setAlertMsg("An error has occurred ! Try again later.")
    }

    return (
        <section className={themeReducer ? "connexion-dark" : "connexion"}>
            <Helmet>
                <title>Signup</title>
            </Helmet>
            <div className={themeReducer ? "connexion-left-dark" : "connexion-left"}>   
                <div className={themeReducer ? "connexion-title-dark" : "connexion-title"}>
                    <h1>Register</h1>
                </div>
                {alertMsg === "" 
                ?   null 
                :   <div className={alertCss ? "alert-danger" : "alert-success"}>
                        <p>{alertMsg}</p>
                    </div>
                }
                <form className="connexion-form" onSubmit={e => handleSubmit(e)} >
                    <div className="connexion-info">
                        <label htmlFor="email" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Mail address</label>
                        <input required type="email" name="email" className="connexion-input" onChange={e => handleChange(e)} />
                    </div>
                    <div className="connexion-info connexion-name">
                        <div>
                            <label htmlFor="lastName" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Last Name</label>
                            <input required type="text" name="lastName" className="connexion-input" onChange={e => handleChange(e)}/>
                        </div>
                        <div>
                            <label htmlFor="firstName" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>First Name</label>
                            <input required type="text" name="firstName" className="connexion-input" onChange={e => handleChange(e)}/>
                        </div>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="password" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Password</label>
                        <input required type="password" name="password" className="connexion-input" onChange={e => handleChange(e)}/>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="passwordVerif" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Verify Password</label>
                        <input required type="password" name="passwordVerif" className="connexion-input" onChange={e => setPasswordVerify(e.target.value)} />
                    </div>
                    <div className="connexion-submit">
                        <button type="submit" className={themeReducer ? "connexion-btn-dark" : "connexion-btn"}>SIGN UP</button>
                    </div>
                    <GoogleLogin
                        className="connexion-google"
                        clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
                        buttonText="Sign up with Google"
                        onSuccess={responseSuccessGoogle}
                        onFailure={responseErrorGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
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

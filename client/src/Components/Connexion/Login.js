import React, {useState} from 'react'
import "../../Styles/connexion.css"
import "../../Styles/Media-Queries/Laptop/connexion.css"
import "../../Styles/Media-Queries/Tablet/connexion.css"
import {Link} from "react-router-dom"
import Auth from "../../Auth"
import Cookie from "js-cookie"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"
import AnimPageConnexionDark from "../../Assets/Images/anim-page-connexion-dark.json"
import {useSelector} from "react-redux"
import Lottie from "react-lottie"
import GoogleLogin from 'react-google-login';

export default function Login() {

    const themeReducer = useSelector(state => state.Theme)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [isCheck, setIsCheck] = useState(false)
    const [data, setData] = useState({
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

    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        const fetch = async () => {
            const res = await Auth.login(data)
            if (!res.alert) {
                if (isCheck) {
                    Cookie.set('user', res.token, {expires: 30})
                } else {
                    Cookie.set('user', res.token, {expires: 1})
                }
                Cookie.set('theme', false, {expires: 999})
                window.location.reload()
            }
            setAletCss(res.alert)
            setAlertMsg(res.message)
        }
        fetch()
    }

    const responseSuccessGoogle = (response) => {
        console.log(response)
      }

    const responseErrorGoogle = (res) => {
        console.log(res)
    }

    return (
        <section className={themeReducer ? "connexion-dark" : "connexion"}>
            <div className={themeReducer ? "connexion-left-dark" : "connexion-left"}>
                <div className={themeReducer ? "connexion-title-dark" : "connexion-title"}>
                    <h1>Login</h1>
                </div>
                {alertMsg === "" 
                ?   null 
                :   <div className={alertCss ? "alert-danger" : "alert-none"}>
                        <p>{alertMsg}</p>
                    </div>
                }
                <form className="connexion-form" onSubmit={e => handleSubmit(e)}>
                    <div className="connexion-info">
                        <label htmlFor="email" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Mail address</label>
                        <input required type="email" name="email" className="connexion-input" onChange={e => handleChange(e)} />
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="password" className={themeReducer ? "connexion-label-dark" : "connexion-label"}>Password</label>
                        <input required type="password" name="password" className="connexion-input" onChange={e => handleChange(e)}/>
                    </div>
                    <div className="connexion-info connexion-checkbox">
                        <input type="checkbox" name="remember" className="connexion-input-checkbox" onChange={() => setIsCheck(!isCheck)} />
                        <label htmlFor="remember" className={themeReducer ? "connexion-label-checkbox-dark" : "connexion-label-checkbox"}>Remember me</label>
                    </div>
                    <div className="connexion-submit">
                        <button type="submit" className={themeReducer ? "connexion-btn-dark" : "connexion-btn"}>SIGN IN</button>
                    </div>
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
                        buttonText="Login with Google"
                        onSuccess={responseSuccessGoogle}
                        onFailure={responseErrorGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </form>
                <div className="connexion-link-box">
                    <Link to="/password-forget" className={themeReducer ? "connexion-link-dark" : "connexion-link"}>Password forget ?</Link>
                    <Link to="/signup" className={themeReducer ? "connexion-link-dark" : "connexion-link"}>Register</Link>
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

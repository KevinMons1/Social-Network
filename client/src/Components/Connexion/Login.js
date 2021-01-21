import React, {useState} from 'react'
import "../../Styles/connexion.css"
import {Link, useHistory} from "react-router-dom"
import axios from "axios"
import Cookie from "js-cookie"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"

export default function Login() {

    const history = useHistory()
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [check, setCheck] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault()

        axios.post("http://localhost:3001/api/auth/login", data)
            .then(res => {
                if (!res.data.alert) {
                    if (check) {
                        Cookie.set('user', res.data.token, {expires: 30})
                    }
                    history.push({pathname: '/'})
                }
                setAletCss(res.data.alert)
                setAlertMsg(res.data.message)
            })
            .catch(err => console.log(err))
    }

    return (
        <section className="connexion">
            <div className="connexion-left">
                <div className="connexion-title">
                    <h1>Login</h1>
                </div>
                {alertMsg === "" 
                ?   null 
                :   <div className={alertCss ? "connexion-alert-danger" : "connexion-alert-none"}>
                        <p>{alertMsg}</p>
                    </div>
                }
                <form className="connexion-form" onSubmit={e => handleSubmit(e)}>
                    <div className="connexion-info">
                        <label htmlFor="email" className="connexion-label">Mail address</label>
                        <input required type="email" name="email" className="connexion-input" onChange={e => handleChange(e)} />
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="password" className="connexion-label">Password</label>
                        <input required type="password" name="password" className="connexion-input" onChange={e => handleChange(e)}/>
                    </div>
                    <div className="connexion-info connexion-checkbox">
                        <input type="checkbox" name="remember" className="connexion-input-checkbox" onChange={() => setCheck(!check)} />
                        <label htmlFor="remember" className="connexion-label-checkbox">Remember me</label>
                    </div>
                    <div className="connexion-submit">
                        <button type="submit" className="connexion-btn">SIGN IN</button>
                    </div>
                </form>
                <div className="connexion-link-box">
                    <Link to="/password-forget" className="connexion-link">Password forget ?</Link>
                    <Link to="/signup" className="connexion-link">Register</Link>
                </div>
            </div>

            <div className="connexion-right">
                <img src={AnimPageConnexion} alt="Animation"/>
            </div>
        </section>
    )
}

import React from 'react'
import {Link} from "react-router-dom"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"

export default function Login() {
    return (
        <section className="connexion">
            <div className="connexion-left">
                <div className="connexion-title">
                    <h1>Login</h1>
                </div>
                <form className="connexion-form">
                    <div className="connexion-info">
                        <label htmlFor="email" className="connexion-label">Mail address</label>
                        <input type="email" name="email" className="connexion-input"/>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="password" className="connexion-label">Password</label>
                        <input type="password" name="password" className="connexion-input"/>
                    </div>
                    <div className="connexion-info connexion-checkbox">
                        <input type="checkbox" name="remember" className="connexion-input-checkbox"/>
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

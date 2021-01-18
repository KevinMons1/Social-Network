import React from 'react'
import {Link} from "react-router-dom"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"

export default function Signup() {
    return (
        <section className="connexion">
            <div className="connexion-left">
                <div className="connexion-title">
                    <h1>Register</h1>
                </div>
                <form className="connexion-form">
                    <div className="connexion-info">
                        <label htmlFor="email" className="connexion-label">Mail address</label>
                        <input type="email" name="email" className="connexion-input"/>
                    </div>
                    <div className="connexion-info connexion-name">
                        <div>
                            <label htmlFor="lastname" className="connexion-label">Last Name</label>
                            <input type="text" name="lastname" className="connexion-input"/>
                        </div>
                        <div>
                            <label htmlFor="firstname" className="connexion-label">First Name</label>
                            <input type="text" name="firstname" className="connexion-input"/>
                        </div>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="password" className="connexion-label">Password</label>
                        <input type="password" name="password" className="connexion-input"/>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="passwordVerif" className="connexion-label">Verify Password</label>
                        <input type="password" name="passwordVerif" className="connexion-input"/>
                    </div>
                    <div className="connexion-submit">
                        <button type="submit" className="connexion-btn">SIGN IN</button>
                    </div>
                </form>
                <div className="connexion-link-box">
                    <Link to="/login" className="connexion-link">Login</Link>
                </div>
            </div>

            <div className="connexion-right">
                <img src={AnimPageConnexion} alt="Animation"/>
            </div>
        </section>
    )
}

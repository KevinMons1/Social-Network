import React from 'react'
import {Link} from 'react-router-dom'
import Lottie from "react-lottie"
import {useSelector} from "react-redux"
import emoji from "../../Assets/Images/emoji.json"
import emojiDark from "../../Assets/Images/emoji-dark.json"

export default function Landing() {
    const themeReducer = useSelector(state => state.Theme)

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: themeReducer ? emojiDark : emoji,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }

    return (
        <div className="MainLanding">
            <Lottie className="landing-emoji" options={defaultOptions} height={"10%"} width={"10%"}/>
            <div className={themeReducer ? "landing-title-dark" : "landing-title"}>
                <h1>My project - social network</h1>
            </div>
            <div className={themeReducer ? "landing-text-dark" : "landing-text"}>
                <p>Hey ! I'm Kévin Monsieur and I'm a self-taught developer. <br/> You will see my biggest project in ReactJs, NodeJs, MySql after you login !</p>
                <p className="landing-text-neon">This project is my 2021 end-of-study work 🎉</p>
            </div>
            <div className="landing-btn">
                <Link className={themeReducer ? "landing-link-dark" : "landing-link"} to="/login">Login</Link>
                <Link className={themeReducer ? "landing-link-dark" : "landing-link"} to="/signup">Signup</Link>
            </div>
        </div>
    )
}

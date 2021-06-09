import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import {useTransition, animated, config} from "react-spring"
import {useSelector} from "react-redux"

export default function Informations({ closeInformations }) {
    const [isAnimated, setIsAnimated] = useState(true)
    const themeReducer = useSelector(state => state.Theme)

    const transitionContent = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "scale(0)"},
        enter: {opacity: 1, transform: "scale(1)"},
        leave: {opacity: 0, transform: "scale(0)"},
        config: config.stiff
    })
    const transitionContentOpacity = useTransition(isAnimated, null, {
        from: {opacity: 0},
        enter: {opacity: 0.5},
        leave: {opacity: 0},
        config: config.stiff
    })

    const handleClose = () => {
        setIsAnimated(!isAnimated)
        setTimeout(() => {
            closeInformations()
        }, 200);
    }

    return (
        <div>
            {transitionContentOpacity.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className="informations-opacity"></animated.div>
            ))}
            {transitionContent.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className={themeReducer ? "informations-content-dark" : "informations-content"}>
                <button className={themeReducer ? "new-publi-icon-btn-dark" : "new-publi-icon-btn"} onClick={() => handleClose()}>
                    <FontAwesomeIcon icon="times-circle" className="new-publi-close-icon"/>
                </button>                    
                    <h3 className={themeReducer ? "informations-box-dark" : null}>Credits</h3>
                    <div className={themeReducer ? "informations-box-dark" : "informations-box"}>
                        <p>Developer: Kévin Monsieur</p>
                        <div className="informations-href">
                            <p>Linkedin:</p>
                            <a href="https://www.linkedin.com/in/k%C3%A9vin-monsieur-a9134a181/" target="blank">here 😃</a>
                        </div>
                        <p>Technologies: ReactJs | NodeJs | MySql</p>
                        <p>Version: 1.1</p>
                    </div>
                </animated.div> 
            ))}
        </div>
    )
}

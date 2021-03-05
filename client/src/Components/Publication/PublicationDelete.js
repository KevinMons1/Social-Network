import React, {useState} from 'react'
import {useSelector} from "react-redux"
import {useTransition, config, animated} from "react-spring"

export default function PublicationDelete( {deletePubli, setDeleteAlert} ) {

    const themeReducer = useSelector(state => state.Theme)
    const [isAnimated, setIsAnimated] = useState(true)
    const transitionDelete = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "scale(0)"},
        enter: {opacity: 1, transform: "scale(1)"},
        leave: {opacity: 0, transform: "scale(0)"},
        config: config.stiff
    })
    const transitionDeleteOpacity = useTransition(isAnimated, null, {
        from: {opacity: 0},
        enter: {opacity: 0.5},
        leave: {opacity: 0},
        config: config.stiff
    })

    const handleCloseDelete = () => {
        setIsAnimated(!isAnimated)
        setTimeout(() => {
            setDeleteAlert(false)
        }, 200);
    }

    return (
        <div className="deleteMsg-container">
            {transitionDeleteOpacity.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className="deleteMsg-opacity"></animated.div>
            ))}
            {transitionDelete.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className={themeReducer ? "deleteMsg-box-dark" : "deleteMsg-box"}>
                    <p className={themeReducer ? "txt-dark" : null}>You are sure to delete this publication ?</p>
                    <div>
                        <button className="deleteMsg-btn delBtn1" onClick={() => deletePubli()}>DELETE</button>
                        <button className="deleteMsg-btn delBtn2" onClick={() => handleCloseDelete()}>CANCEL</button>
                    </div>
                </animated.div>
            ))}
        </div>
    )
}

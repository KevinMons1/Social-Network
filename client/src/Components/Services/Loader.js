import React from 'react'
import "./../../Styles/services.css"

export default function Loader({ isMini }) {
    return (
        <div className="loader">
            <div className={isMini ? "loaderAnim-mini": "loaderAnim"}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

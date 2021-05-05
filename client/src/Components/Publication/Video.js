import React, {useState, useRef} from 'react'
import {useDispatch} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import { useMediaQuery } from 'react-responsive'

export default function Video({ data, clickNo, isTall }) {

    const videoControlsRef = useRef()
    const videoRef = useRef()
    const videoVolumeRef = useRef()
    const videoBarRef = useRef()
    const btnPlayRef = useRef()
    const barreRef = useRef()
    const dispatch = useDispatch()
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
    const [mute, setMute] = useState(false)
    const [toTall, setToTall] = useState(false)
    const [isClicked, setIsClicked] = useState(false)

    const handleVideo = (isClickWithBtn) => {
        if (!clickNo) {
            if (isClickWithBtn) {
                if (videoRef.current.paused) {
                    btnPlayRef.current.className = "video-btn video-btn-play video-pause"
                    videoRef.current.play()
                } else {
                    btnPlayRef.current.className = "video-btn video-btn-play video-play"
                    videoRef.current.pause()
                }              
            } else {
                const isTallClass = isTall 
                ? "video-content-mobile-tall"
                : "video-content-mobile"

                if (isTabletOrMobile) {
                    if (isClicked) {
                        videoControlsRef.current.className = "video-controls"
                    } else {
                        videoControlsRef.current.className = `video-controls ${isTallClass}`
                    }
                    setIsClicked(!isClicked)
                }
            }
        }
    }

    const handleVideoRun = e => {
        if (!clickNo) {
            let juicePos = videoRef.current.currentTime / videoRef.current.duration
            barreRef.current.style.width = juicePos * 100 + "%"
    
            if (videoRef.current.ended) {
                btnPlayRef.current.className = "video-btn video-btn-play video-play"
            }
        }
    }

    const handleMute = () => {
        if (!clickNo) {
            if (videoRef.current.muted) {
                videoRef.current.muted = false
                setMute(false)
            } else {
                videoRef.current.muted = true
                setMute(true)
            }
        }
    }

    const handleChangeVolume = () => {
        if (!clickNo) {
            videoRef.current.volume = videoVolumeRef.current.value / 100
        }      
    }

    const handleClickVideo = e => {
        if (!clickNo) {
            let rect = videoBarRef.current.getBoundingClientRect()
            let width = rect.width
            let x = e.clientX - rect.left // Get where you clicked
            let widthPercent = ((x * 100) / width)
            let currentTimeTrue = (widthPercent * videoRef.current.duration) / 100

            videoRef.current.currentTime = currentTimeTrue
            barreRef.current.style.width = widthPercent + "%"
        }
    }

    const handleDoubleClick = () => {
        if (isTall) {
            dispatch({
                type: "CLOSE_FULL_FILE"
            })
        } else {
            btnPlayRef.current.className = "video-btn video-btn-play video-play"
            videoRef.current.pause()
            dispatch({
                type: "OPEN_FULL_FILE",
                payload: data
            })
        }
    }

    const handleClickTall = () => {
        if (toTall || isTall) {
            dispatch({
                type: "CLOSE_FULL_FILE"
            })
        } else {
            btnPlayRef.current.className = "video-btn video-btn-play video-play"
            videoRef.current.pause()
            dispatch({
                type: "OPEN_FULL_FILE",
                payload: data
            })
        }
        setToTall(!toTall)
    }

    return (
        <div className={isTall ? "video-content-tall" : "video-content"}>                
            <video 
                src={data.publicationFileUrl} 
                className={isTall ? "video-tall" : "video"}
                ref={videoRef} 
                onClick={() => isTabletOrMobile ? handleVideo(false) : handleVideo(true)} 
                onTimeUpdate={e => handleVideoRun(e)}
                onDoubleClick={() => handleDoubleClick()}>
            </video>
            <div ref={videoControlsRef} className="video-controls">
                <div className="video-bar" ref={videoBarRef} onClick={e => handleClickVideo(e)}>
                    <div className="video-par-run" ref={barreRef}></div>
                </div>
                <div className="video-btn-content">
                    <button ref={btnPlayRef} className="video-btn video-btn-play" onClick={() => handleVideo(true)}></button>
                    <button className="video-btn video-btn-mute" onClick={() => handleMute()}>
                        {mute 
                        ?   <FontAwesomeIcon icon="volume-mute" />
                        :   <FontAwesomeIcon icon="volume-up" />
                        }
                    </button>
                    <input type="range" className="video-volume" min="0" max="100" defaultValue="50" step="1" ref={videoVolumeRef} onChange={() => handleChangeVolume()} />
                    <button className="video-btn" onClick={() => handleClickTall()}>
                        <div className="video-rectangle"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}

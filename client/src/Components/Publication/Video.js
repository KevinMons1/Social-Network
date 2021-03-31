import React, {useState, useRef} from 'react'

export default function Video({ data, clickNo }) {

    const videoRef = useRef()
    const videoVolumeRef = useRef()
    const videoBarRef = useRef()
    const btnPlayRef = useRef()
    const barreRef = useRef()
    const [mute, setMute] = useState("Mute")

    const handleVideo = () => {
        if (!clickNo) {
            if (videoRef.current.paused) {
                btnPlayRef.current.className = "video-btn video-btn-play video-pause"
                videoRef.current.play()
            } else {
                btnPlayRef.current.className = "video-btn video-btn-play video-play"
                videoRef.current.pause()
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
                setMute("Mute")
            } else {
                videoRef.current.muted = true
                setMute("Unmute")
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
            let widthPercent = (x * 100) / width
            let currentTimeTrue = (widthPercent * 60) / 100
            videoRef.current.currentTime = currentTimeTrue
            barreRef.current.style.width = widthPercent + "%"
        }
    }

    return (
        <div className="video-content">                
            <video src={data.publicationFileUrl} className="video" ref={videoRef} onTimeUpdate={e => handleVideoRun(e)} ></video>
            <div className="video-controls">
                <div className="video-bar" ref={videoBarRef} onClick={e => handleClickVideo(e)}>
                    <div className="video-par-run" ref={barreRef}></div>
                </div>
                <div className="video-btn-content">
                    <button ref={btnPlayRef} className="video-btn video-btn-play" onClick={() => handleVideo()}></button>
                    <button className="video-btn video-btn-mute" onClick={() => handleMute()}>{mute}</button>
                    <input type="range" className="video-volume" min="0" max="100" defaultValue="50" step="1" ref={videoVolumeRef} onChange={() => handleChangeVolume()} />
                </div>
            </div>
        </div>
    )
}

import React, {useState, useEffect} from 'react'
import "../../Styles/services.css"
import axios from "axios"
import {keyGiphy} from "../../Api"

export default function Gifs({search, handleSubmitGif}) {

    const [data, setData] = useState(null)
    const [gifVisible, setGifVisible] = useState(false)

    useEffect(() => {
        axios.get("https://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: keyGiphy,
                limit: 20,
                q: search
            }
        })
        .then(res => {
            setData(res.data.data)
            setGifVisible(true)
        })
        .catch(err => console.log(err))
    }, [search])
    
    const handleClick = item => {
        handleSubmitGif(item.embed_url)
    }
    
    return (
        <div className="gif-carousel">
            { gifVisible
            ? data.map((item, key) => {
                return <img key={key} src={item.images.fixed_height_small.url} alt={item.title} onClick={() => handleClick(item)} />
            }) 
            : null }
        </div>
    )
}

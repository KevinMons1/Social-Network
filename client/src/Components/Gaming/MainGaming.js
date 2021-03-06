import React, {useState, useEffect} from 'react'
import "../../Styles/gaming.css"
import "../../Styles/Media-Queries/Tablet/gaming.css"
import {useSelector, useDispatch} from "react-redux"
import {apiTwitch} from "../../Api"
import StreamCard from "./StreamCard"
import PublicationCardLoader from "../Publication/PublicationCardLoader"

export default function MainGaming() {

    const dispatch = useDispatch()
    const [streams, setStreams] = useState([])
    const [getApi, setGetApi] = useState([])
    const [load, setLoad] = useState(false)
    const themeReducer = useSelector(state => state.Theme)

    // Take all informations for modify each url with good params
    useEffect(() => {

        dispatch({
            type: "CHANGE_ZINDEX",
            payload: false
          })

        const fetchData = async () => {
            const res = await apiTwitch.get('https://api.twitch.tv/helix/streams?first=100')
            let dataArray = res.data.data
            setGetApi(dataArray)

            let gameIDs = dataArray.map(stream => {
                return stream.game_id
            })

            let userIDs = dataArray.map(stream => {
                return stream.user_id
            })

            // Create URL
            let urlGames = "https://api.twitch.tv/helix/games?"
            let urlUsers = "https://api.twitch.tv/helix/users?"

            let queryParamsGame = ""
            let queryParamsUser = ""

            gameIDs.map(id => {
                return (queryParamsGame = queryParamsGame + `id=${id}&`)
            })

            userIDs.map(id => {
                return (queryParamsUser = queryParamsUser + `id=${id}&`)
            })

            let urlFinalGames = urlGames + queryParamsGame
            let urlFinalUsers = urlUsers + queryParamsUser

            // Call URL
            let gamesCall = await apiTwitch.get(urlFinalGames)
            let usersCall = await apiTwitch.get(urlFinalUsers)

            let gamesCallArray = gamesCall.data.data
            let usersCallArray = usersCall.data.data

            let newUrl = ""

            // Array Final
            let finalArray = dataArray.map(stream => {
                stream.gameName = ""
                stream.login = ""
                stream.channelImg = ""

                newUrl = stream.thumbnail_url
                .replace('{width}', '480')
                .replace('{height}', '270')

                stream.streamImg = newUrl

                gamesCallArray.forEach(name => {
                    usersCallArray.forEach(user => {
                        if (stream.user_id === user.id && stream.game_id === name.id) {
                            stream.gameName = name.name
                            stream.channelImg = user.profile_image_url
                            stream.login = user.login
                        }
                    })
                })

                return stream
            })
            setStreams(finalArray)
            setLoad(true)
        }
        fetchData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleLanguage = choice => {
        let newDataArray = [];

        //Sort by lang
        if (choice !== "all") {
            for (let i = 0; i < getApi.length; i++) {
                if (getApi[i].language === choice) {
                    newDataArray.push(getApi[i])
                }
            }
        } else return setStreams(getApi)

        return setStreams(newDataArray)
    }
    
    return (
        <div className={themeReducer ? "mainGaming-dark" : "mainGaming"}>

            <div className="gaming-lang">
                <div className={themeReducer ? "gaming-lang-box-dark" : "gaming-lang-box"} onClick={() => handleLanguage("all")}>
                    <p>ALL</p>
                </div>
                <div className={themeReducer ? "gaming-lang-box-dark" : "gaming-lang-box"} onClick={() => handleLanguage("en")}>
                    <p>EN</p>
                </div><div className={themeReducer ? "gaming-lang-box-dark" : "gaming-lang-box"} onClick={() => handleLanguage("fr")}>
                    <p>FR</p>
                </div>
            </div>
            {load 
            ? streams.map((stream, index) => {
                return (
                    <StreamCard 
                        login={stream.login}
                        name={stream.user_name}
                        channelImg={stream.channelImg} 
                        streamImg={stream.streamImg}
                        viewerCount={stream.viewer_count}
                        gamePlay={stream.gameName} 
                        key={index} 
                    />
                )
            })  
            : <div className="streamCardLoader">
                <PublicationCardLoader />
                <PublicationCardLoader />
                <PublicationCardLoader />
                </div>
            }

        </div>
    )
}

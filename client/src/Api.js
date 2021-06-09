import axios from "axios"
import io from "socket.io-client"

// Socket.io
export const socket = io(process.env.REACT_APP_URL, {
    forceNew : false , 
    secure : true ,
    transports: [ 'websocket' ] 
})

// Twitch API
export const apiTwitch = axios.create({
    headers: {
        "Client-ID": process.env.REACT_APP_TWITCH_KEY,
        "Authorization": process.env.REACT_APP_TWITCH_AUTH
    }
})

// Giphy API
export const keyGiphy = process.env.REACT_APP_GIFY_KEY


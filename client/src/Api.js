import axios from "axios"
import io from "socket.io-client"

// Socket.io
export const socket = io("localhost:3001", {
    forceNew : false , 
    secure : true ,
    transports: [ 'websocket' ] 
})

// Twitch API
export const apiTwitch = axios.create({
    headers: {
        "Client-ID": "w3h4n1skz9glqio8msixevacl3n7e0",
        "Authorization": "Bearer y0hw866p20jm77qyc5d1qo5jjnb1o7"
    }
})

// https://id.twitch.tv/oauth2/authorize?client_id=w3h4n1skz9glqio8msixevacl3n7e0&redirect_uri=https://127.0.0.1/&response_type=token

// Giphy API

export const keyGiphy = "p6c0Ct0mrOiMKSHtVavlcR3On6hNhFQ7"


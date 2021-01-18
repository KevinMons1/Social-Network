import axios from "axios"

// Call Twitch API

let api = axios.create({
    headers: {
        "Client-ID": "w3h4n1skz9glqio8msixevacl3n7e0",
        "Authorization": "Bearer 3fu108se1z1ohii6vergovj9mpxmax"
    }
})

// https://id.twitch.tv/oauth2/authorize?client_id=w3h4n1skz9glqio8msixevacl3n7e0&redirect_uri=https://127.0.0.1/&response_type=token

export default api
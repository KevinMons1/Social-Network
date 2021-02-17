import axios from "axios"
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from "@giphy/react-components";

// Twitch API
export const apiTwitch = axios.create({
    headers: {
        "Client-ID": "w3h4n1skz9glqio8msixevacl3n7e0",
        "Authorization": "Bearer 3fu108se1z1ohii6vergovj9mpxmax"
    }
})

// https://id.twitch.tv/oauth2/authorize?client_id=w3h4n1skz9glqio8msixevacl3n7e0&redirect_uri=https://127.0.0.1/&response_type=token

// Giphy API

const keyGiphy = new GiphyFetch("p6c0Ct0mrOiMKSHtVavlcR3On6hNhFQ7")

export const Gifs = () => {
    const fetch = offset => {
        keyGiphy.trending({ offset, limit: 10 })
    }
    return <Grid width={200} columns={4} gutter={6} fetchGifs={fetch}/>
}

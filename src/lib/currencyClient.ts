import axios from "axios";

export const currencyClient = axios.create({
    baseURL: 'https://api.currencyapi.com/v3',
    params: {
        apikey: process.env.API_KEY
    }
})
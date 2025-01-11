import axios from "axios";

export const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
        "ngrok-skip-browser-warning": true,
    },
});
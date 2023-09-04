import axios from "axios";

const axiosFetch = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    withCredentials: true
});

export default axiosFetch;
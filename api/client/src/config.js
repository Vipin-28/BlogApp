import axios from "axios";

//axiosInstance
export const axiosInstance = axios.create({
    baseURL : "https://webblog-mern.herokuapp.com/api/"
});
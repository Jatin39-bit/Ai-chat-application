import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://chat-application-backend-vert.vercel.app/"
    });

export default axiosInstance
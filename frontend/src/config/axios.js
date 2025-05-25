import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://ai-chat-application-hqz2.onrender.com/"
    });

export default axiosInstance
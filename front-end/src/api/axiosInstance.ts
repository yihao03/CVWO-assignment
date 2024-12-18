import axios from "axios"
// import viteConfig from "../../vite.config.js";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 5000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
});

export default apiClient;
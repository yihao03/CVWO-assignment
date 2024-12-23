import axios from "axios";
// import viteConfig from "../../vite.config.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: {
    "Access-Control-Allow-Origin": import.meta.env.VITE_BACKEND_URL,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default apiClient;

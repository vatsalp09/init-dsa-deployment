import axios from "axios";

const mode = import.meta.env.VITE_MODE;
const localUrl = import.meta.env.VITE_LOCAL_API_URL;
const liveUrl = import.meta.env.VITE_LIVE_API_URL;

const baseURL = mode === "development" ? localUrl : liveUrl;

console.log("Running in", mode, "mode. Using baseURL:", baseURL);

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

import axios from "axios";
console.log(import.meta.env.MODE)
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1" : "https://initdsa.onrender.com/api/v1",
  withCredentials: true,
});
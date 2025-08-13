import axios from "axios";
// localhost
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

//englishbe.onrender.com


https: http.interceptors.request.use((config) => {
  // console.log("Request made with ", baseURL);
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default http;

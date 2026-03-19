import axios from "axios";
import { getCookie } from "cookies-next";

// Configure axios to automatically send cookies with requests
axios.defaults.withCredentials = true;

// Automatically attach auth token as Authorization header on every request
axios.interceptors.request.use((config) => {
  const token = getCookie("auth-token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axios;

import axios from "axios";
import { getCookie } from "cookies-next";
import { normalizeMediaUrlsDeep } from "@/utils/functions/normalize-media-url";

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

// Normalize media URLs from API responses so data saved with localhost
// or relative /storage paths still loads correctly in production.
axios.interceptors.response.use((response) => {
  if (response?.data !== undefined) {
    response.data = normalizeMediaUrlsDeep(response.data);
  }
  return response;
});

export default axios;

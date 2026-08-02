import axios from "axios";
import { normalizeMediaUrlsDeep } from "@/utils/functions/media";

// Use a private instance so interceptors are never duplicated on HMR re-evaluations
const instance = axios.create({
  withCredentials: true,
  // Longer than the gateway's normal 10s RPC timeout and its 20s search
  // timeout, but finite so a broken connection cannot leave the UI spinning.
  timeout: 30_000,
});

// Normalize media URLs from API responses so data saved with localhost
// or relative /storage paths still loads correctly in production.
instance.interceptors.response.use((response) => {
  if (response?.data !== undefined) {
    response.data = normalizeMediaUrlsDeep(response.data);
  }
  return response;
});

export default instance;

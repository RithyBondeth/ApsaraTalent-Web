import axios from "axios";
import { normalizeMediaUrlsDeep } from "@/utils/functions/media";

// Use a private instance so interceptors are never duplicated on HMR re-evaluations
const instance = axios.create({
  withCredentials: true,
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

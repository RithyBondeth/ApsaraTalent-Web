import axios from "axios";

// Configure axios to automatically send cookies with requests
axios.defaults.withCredentials = true;

export default axios;

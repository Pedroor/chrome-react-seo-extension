import axios from "axios";

const api = axios.create({
  baseURL: "https://extension.free.beeceptor.com",
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://10.205.43.38:4000/", // change this
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add interceptor for auth token
api.interceptors.request.use(
  async (config) => {
    // get token from zustand store
    const { user } = require("../store/useAuthStore").useAuthStore.getState();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

import axios from "axios";
import Cookies from "js-cookie";
export const baseUrlStock = `wss://hire-hub-backend-24125c11c709.herokuapp.com/`; 
export const baseURL = `https://hire-hub-backend-24125c11c709.herokuapp.com/`; 
const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isAuthRoute =
      (config.url?.includes("/api/auth/login") ?? false) ||
      (config.url?.includes("/api/auth/register") ?? false);
    
    if (!isAuthRoute) {
      const token = Cookies?.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(new Error(error?.message));
  },
);

export default axiosInstance;

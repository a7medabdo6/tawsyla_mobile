// src/api/axios.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGlobalLogout, useLogoutHandler } from "./useAuth";

const api = axios.create({
  baseURL: "http://159.65.75.17:3000/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(token, "token");
    } catch (error) {
      console.error("Error getting token for request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        console.log("User unauthorized, triggering global logout");

        // Call the global logout function
        await handleGlobalLogout();

        // Note: To handle navigation after logout, use the useLogoutHandler hook in your components
        // Example:
        //  const { handleLogout } = useLogoutHandler(navigation);
        // Then call handleLogout() when you want to navigate to login
      } catch (logoutError) {
        console.error("Error during logout from interceptor:", logoutError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

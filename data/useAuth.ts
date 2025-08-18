// src/api/authApi.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./instance";

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  token: string;
  refreshToken?: string;
}

// API functions
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("v1/auth/email/login", credentials);
  return response.data;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post("v1/auth/email/registerr", credentials);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("v1/auth/logout");
};

// React Query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      try {
        // console.log(data,'authStatus');
        
        // Store token and user data in AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        if (data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
        }
        
        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        // Force authStatus to update immediately
        queryClient.setQueryData(["authStatus"], { isAuthenticated: true, user: data.user });
        
        // Set user data in cache
        queryClient.setQueryData(["user"], data.user);
      } catch (error) {
        console.error("Error storing auth data:", error);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      try {
        // Store token and user data in AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        if (data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
        }
        
        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        // Force authStatus to update immediately
        queryClient.setQueryData(["authStatus"], { isAuthenticated: true, user: data.user });
        
        // Set user data in cache
        queryClient.setQueryData(["user"], data.user);
      } catch (error) {
        console.error("Error storing auth data:", error);
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
 };

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, void>({
    mutationFn: logoutUser,
    onSuccess: async () => {
      try {
        // Clear all auth data from AsyncStorage
        await AsyncStorage.multiRemove(['token', 'user', 'refreshToken']);
        
        // Clear all user-related data from cache
        queryClient.removeQueries({ queryKey: ["user"] });
        queryClient.removeQueries({ queryKey: ["profile"] });
        
        // Specifically invalidate the authStatus query to force re-fetch
        queryClient.invalidateQueries({ queryKey: ["authStatus"] });
        
        // Also clear the authStatus data
        queryClient.setQueryData(["authStatus"], { isAuthenticated: false, user: null });
        
        queryClient.clear();
      } catch (error) {
        console.error("Error clearing auth data:", error);
      }
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
}; 

// Utility functions for managing authentication state
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

export const getStoredUser = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

export const getStoredRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Error getting stored refresh token:', error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(['token', 'user', 'refreshToken']);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}; 

// Hook for checking authentication status on app startup
export const useAuthStatus = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      const token = await getStoredToken();
      const user = await getStoredUser();
      console.log(user,'useruser');
      
      if (token && user) {
        // Set user data in cache if we have stored data
        queryClient.setQueryData(["user"], user);
        return { isAuthenticated: true, user };
      }
      
      return { isAuthenticated: false, user: null };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 
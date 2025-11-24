// src/api/authApi.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./instance";
import { useCallback } from "react";
import PushNotificationService from "../utils/pushNotificationService";

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
  pushToken?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  phone:string
}

export interface UpdateProfileCredentials {
  firstName?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
  };
  token: string;
  refreshToken?: string;
}

// Global logout function that can be called from anywhere
export const handleGlobalLogout = async () => {
  try {
    // Clear all auth data from AsyncStorage
    await AsyncStorage.multiRemove(['token', 'user', 'refreshToken']);
    
    // Clear push token
    const pushNotificationService = PushNotificationService.getInstance();
    await pushNotificationService.clearPushToken();
    
    // You can add more cleanup here if needed
    // await AsyncStorage.multiRemove(['cart', 'favorites', 'settings']);
    
    console.log('Global logout completed');
    
    // Return true to indicate successful logout
    return true;
  } catch (error) {
    console.error('Error during global logout:', error);
    return false;
  }
};

// API functions
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("v1/auth/email/login", credentials);
  return response.data;
};

// API function to update push token
export const updatePushToken = async (id: string, pushToken: string): Promise<void> => {
  const response = await api.post(`v1/users/${id}/push-token`, { pushToken });
  return response.data;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post("v1/auth/email/register", credentials);
  return response.data;
};

export const updateProfile = async (credentials: UpdateProfileCredentials): Promise<AuthResponse> => {
  const response = await api.patch("v1/auth/me", credentials);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("v1/auth/logout");
};

// React Query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      // Get push token before login
      const pushNotificationService = PushNotificationService.getInstance();
      const pushToken = await pushNotificationService.getStoredPushToken() || 
                       await pushNotificationService.registerForPushNotifications();
      
      // Include push token in login credentials
      const loginData = {
        ...credentials,
        pushToken: pushToken || undefined,
      };
      
      return loginUser(loginData);
    },
    onSuccess: async (data) => {
      try {
        // console.log(data,'authStatus');
        
        // Store token and user data in AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        if (data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
        }
        
        // Update push token on the server after successful login
        const pushNotificationService = PushNotificationService.getInstance();
        const pushToken = pushNotificationService.getPushToken();
        if (pushToken) {
          try {
            await updatePushToken(data?.user?.id,pushToken);
            console.log('Push token updated successfully');
          } catch (error) {
            console.error('Error updating push token:', error);
            // Don't fail login if push token update fails
          }
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
        // // Store token and user data in AsyncStorage
        // await AsyncStorage.setItem('token', data.token);
        // if (data.refreshToken) {
        //   await AsyncStorage.setItem('refreshToken', data.refreshToken);
        // }
        
        // // Invalidate and refetch user-related queries
        // queryClient.invalidateQueries({ queryKey: ["user"] });
        // queryClient.invalidateQueries({ queryKey: ["profile"] });
        // // Force authStatus to update immediately
        // queryClient.setQueryData(["authStatus"], { isAuthenticated: true, user: data.user });
        
        // // Set user data in cache
        // queryClient.setQueryData(["user"], data.user);
      } catch (error) {
        console.error("Error storing auth data:", error);
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
 };

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, UpdateProfileCredentials>({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      try {
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        
        // Update authStatus with new user data
        queryClient.setQueryData(["authStatus"], { isAuthenticated: true, user: data.user });
        
        // Set updated user data in cache
        queryClient.setQueryData(["user"], data.user);
      } catch (error) {
        console.error("Error updating profile data:", error);
      }
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
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
        
        // Clear push token
        const pushNotificationService = PushNotificationService.getInstance();
        await pushNotificationService.clearPushToken();
        
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

// Hook for updating push token
export const useUpdatePushToken = () => {
  return useMutation<any, Error, {id: string, pushToken: string}>({
    mutationFn: ({id, pushToken}) => updatePushToken(id, pushToken),
    onSuccess: (data) => {
      console.log('Push token updated successfully');
      return data;
    },
    onError: (error) => {
      console.error('Push token update failed:', error);
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

// Hook for components to handle logout events
export const useLogoutHandler = (navigation: any) => {
  const queryClient = useQueryClient();
  
  const handleLogout = useCallback(async () => {
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
      
      // Navigate to login screen
      if (navigation && navigation.navigate) {
        navigation.navigate("login");
      }
      
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [queryClient, navigation]);

  return { handleLogout };
}; 
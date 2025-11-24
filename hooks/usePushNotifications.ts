import { useEffect, useState } from 'react';
import PushNotificationService from '../utils/pushNotificationService';
import { useUpdatePushToken } from '../data/useAuth';

export const usePushNotifications = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updatePushTokenMutation = useUpdatePushToken();

  const pushNotificationService = PushNotificationService.getInstance();

  // Initialize push notifications
  const initializePushNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await pushNotificationService.initialize();
      const token = pushNotificationService.getPushToken();
      setPushToken(token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize push notifications';
      setError(errorMessage);
      console.error('Error initializing push notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Register for push notifications
  const registerForPushNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await pushNotificationService.registerForPushNotifications();
      setPushToken(token);
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register for push notifications';
      setError(errorMessage);
      console.error('Error registering for push notifications:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update push token on server
  const updatePushTokenOnServer = async (id: string, token: string) => {
    try {
      await updatePushTokenMutation.mutateAsync({id,pushToken:token});
      return true;
    } catch (err) {
      console.error('Error updating push token on server:', err);
      return false;
    }
  };

  // Clear push token
  const clearPushToken = async () => {
    try {
      await pushNotificationService.clearPushToken();
      setPushToken(null);
    } catch (err) {
      console.error('Error clearing push token:', err);
    }
  };

  // Get current push token
  const getCurrentPushToken = () => {
    return pushNotificationService.getPushToken();
  };

  // Initialize on mount
  useEffect(() => {
    initializePushNotifications();
  }, []);

  return {
    pushToken,
    isLoading: isLoading || updatePushTokenMutation.isPending,
    error: error || (updatePushTokenMutation.error?.message || null),
    initializePushNotifications,
    registerForPushNotifications,
    updatePushTokenOnServer,
    clearPushToken,
    getCurrentPushToken,
  };
};

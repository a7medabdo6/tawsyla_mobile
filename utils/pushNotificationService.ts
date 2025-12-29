import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushTokenData {
  token: string;
  type: 'expo' | 'fcm' | 'apns';
  deviceId?: string;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private pushToken: string | null = null;

  private constructor() { }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Request notification permissions
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Register for push notifications and get the push token
   */
  public async registerForPushNotifications(): Promise<string | null> {
    try {
      // Check if permissions are granted
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        // console.log('Push notification permissions not granted');
        return null;
      }

      // Get the push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'b725ce55-00cd-4897-acf5-8b43b5c79f2b', // From app.json
      });

      this.pushToken = tokenData.data;

      // Store the token in AsyncStorage
      await this.storePushToken(this.pushToken);

      // console.log('Push token registered:', this.pushToken);
      return this.pushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Get the current push token
   */
  public getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Store push token in AsyncStorage
   */
  private async storePushToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('pushToken', token);
    } catch (error) {
      console.error('Error storing push token:', error);
    }
  }

  /**
   * Retrieve push token from AsyncStorage
   */
  public async getStoredPushToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('pushToken');
      if (token) {
        this.pushToken = token;
      }
      return token;
    } catch (error) {
      console.error('Error retrieving stored push token:', error);
      return null;
    }
  }

  /**
   * Clear push token from storage
   */
  public async clearPushToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('pushToken');
      this.pushToken = null;
    } catch (error) {
      console.error('Error clearing push token:', error);
    }
  }

  /**
   * Get device information for push token registration
   */
  public getDeviceInfo(): { platform: string; deviceId?: string } {
    return {
      platform: Platform.OS,
      // You can add device ID logic here if needed
    };
  }

  /**
   * Format push token data for API submission
   */
  public getPushTokenData(): PushTokenData | null {
    if (!this.pushToken) return null;

    return {
      token: this.pushToken,
      type: 'expo', // For Expo managed workflow
      ...this.getDeviceInfo(),
    };
  }

  /**
   * Initialize push notifications (call this on app startup)
   */
  public async initialize(): Promise<void> {
    try {
      // Try to get stored token first
      const storedToken = await this.getStoredPushToken();

      if (storedToken) {
        // console.log('Using stored push token:', storedToken);
        return;
      }

      // If no stored token, register for new one
      await this.registerForPushNotifications();
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
}

export default PushNotificationService;

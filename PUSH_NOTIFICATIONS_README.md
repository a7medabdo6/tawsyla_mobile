# Push Notifications Implementation

This document describes the push notification implementation for the Saska app, including how push tokens are managed and sent to the backend during user login.

## Overview

The push notification system automatically:
1. Requests notification permissions on app startup
2. Registers for push notifications and obtains a push token
3. Sends the push token to the backend during user login
4. Updates the push token on the server after successful authentication
5. Clears the push token when the user logs out

## Files Added/Modified

### New Files
- `utils/pushNotificationService.ts` - Core push notification service
- `hooks/usePushNotifications.ts` - React hook for push notifications
- `components/PushNotificationExample.tsx` - Example component for testing

### Modified Files
- `data/useAuth.ts` - Updated to include push token in login flow
- `app/_layout.tsx` - Initialize push notifications on app startup
- `app.json` - Added expo-notifications plugin configuration
- `data/index.ts` - Export push notification hook

## API Endpoints

The implementation expects the following backend endpoints:

### POST /api/v1/auth/email/login
Login endpoint that accepts push token in the request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

### POST /api/v1/auth/push-token
Update push token endpoint:
```json
{
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

## Usage

### Basic Usage in Components

```typescript
import { usePushNotifications } from '@/data';

const MyComponent = () => {
  const {
    pushToken,
    isLoading,
    error,
    registerForPushNotifications,
    updatePushTokenOnServer,
    clearPushToken,
  } = usePushNotifications();

  // Use the push notification functionality
  // ...
};
```

### Automatic Integration

The push notification system is automatically integrated into the login flow. When a user logs in:

1. The system checks for an existing push token
2. If no token exists, it registers for push notifications
3. The push token is included in the login request
4. After successful login, the push token is updated on the server

### Manual Push Token Management

```typescript
import PushNotificationService from '@/utils/pushNotificationService';

// Get the service instance
const pushService = PushNotificationService.getInstance();

// Register for push notifications
const token = await pushService.registerForPushNotifications();

// Get current token
const currentToken = pushService.getPushToken();

// Clear token
await pushService.clearPushToken();
```

## Configuration

### Expo Project ID
The Expo project ID is configured in `app.json` and used in `pushNotificationService.ts`:
```typescript
const tokenData = await Notifications.getExpoPushTokenAsync({
  projectId: 'b725ce55-00cd-4897-acf5-8b43b5c79f2b',
});
```

### Notification Handler
Notifications are configured to show alerts, play sounds, and display banners when the app is in the foreground:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
```

## Testing

Use the `PushNotificationExample` component to test the push notification functionality:

```typescript
import PushNotificationExample from '@/components/PushNotificationExample';

// Add to any screen for testing
<PushNotificationExample />
```

## Backend Integration

### Expected Backend Response

The login endpoint should return the standard auth response:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### Push Token Storage

The backend should store the push token associated with the user account for sending notifications later.

## Error Handling

The implementation includes comprehensive error handling:
- Permission denied errors
- Network errors when updating tokens
- Invalid token errors
- Service unavailable errors

All errors are logged to the console and can be accessed through the `usePushNotifications` hook.

## Dependencies

The following dependencies were added:
- `expo-notifications` - For push notification functionality

## Platform Support

This implementation supports:
- iOS (using APNs)
- Android (using FCM)
- Expo managed workflow

## Security Considerations

1. Push tokens are stored locally in AsyncStorage
2. Tokens are sent over HTTPS to the backend
3. Tokens are cleared when users log out
4. No sensitive data is included in push tokens

## Troubleshooting

### Common Issues

1. **No push token received**: Check if notification permissions are granted
2. **Token not updating on server**: Verify the backend endpoint is working
3. **Notifications not received**: Check if the app is properly configured for push notifications

### Debug Information

Enable debug logging by checking the console for:
- Push token registration logs
- API call logs
- Error messages

## Future Enhancements

Potential improvements:
1. Token refresh mechanism
2. Multiple device support
3. Notification categories
4. Rich notification support
5. Notification history

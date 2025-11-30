import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { COLORS } from "../constants";

const PushNotificationExample: React.FC = () => {
  const {
    pushToken,
    isLoading,
    error,
    registerForPushNotifications,
    updatePushTokenOnServer,
    clearPushToken,
  } = usePushNotifications();

  const handleRegisterPushNotifications = async () => {
    const token = await registerForPushNotifications();
    if (token) {
      Alert.alert("Success", "Push notifications registered successfully!");
    } else {
      Alert.alert("Error", "Failed to register for push notifications");
    }
  };

  const handleUpdateTokenOnServer = async () => {
    if (pushToken) {
      // TODO: Pass actual user ID here
      const success = await updatePushTokenOnServer("test-user-id", pushToken);
      if (success) {
        Alert.alert("Success", "Push token updated on server!");
      } else {
        Alert.alert("Error", "Failed to update push token on server");
      }
    } else {
      Alert.alert("Error", "No push token available");
    }
  };

  const handleClearToken = async () => {
    await clearPushToken();
    Alert.alert("Success", "Push token cleared!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notification Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.status,
            { color: pushToken ? COLORS.primary : COLORS.gray },
          ]}
        >
          {isLoading
            ? "Loading..."
            : pushToken
            ? "Registered"
            : "Not Registered"}
        </Text>
      </View>

      {pushToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.label}>Token:</Text>
          <Text style={styles.token} numberOfLines={2}>
            {pushToken}
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleRegisterPushNotifications}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Register Push Notifications</Text>
        </TouchableOpacity>

        {pushToken && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleUpdateTokenOnServer}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Update Token on Server</Text>
          </TouchableOpacity>
        )}

        {pushToken && (
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearToken}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Clear Token</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginRight: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: "500",
  },
  tokenContainer: {
    marginBottom: 15,
  },
  token: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: "monospace",
    backgroundColor: COLORS.grayscale100,
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  errorContainer: {
    backgroundColor: COLORS.red + "20",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 14,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  dangerButton: {
    backgroundColor: COLORS.red,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PushNotificationExample;

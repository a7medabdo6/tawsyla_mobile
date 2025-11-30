import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";

interface TabScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

/**
 * Wrapper component for tab screens that adds bottom padding
 * to prevent content from being covered by the custom tab bar
 */
const TabScreenWrapper: React.FC<TabScreenWrapperProps> = ({
  children,
  style,
  backgroundColor = "#f8f9fa",
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={["top"]}
    >
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 70, // Space for the custom tab bar
  },
});

export default TabScreenWrapper;

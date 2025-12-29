import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Image } from "expo-image";
import { images } from "../constants";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "expo-router";

type Nav = {
  navigate: (value: string) => void;
};

const Onboarding1 = () => {
  const { navigate } = useNavigation<Nav>();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Wait for 1.5 seconds, then animate out
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigate("(tabs)");
      });
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.area,
        { opacity: fadeAnim },
      ]}
    >
      <StatusBar hidden />
      <Image source={images.loading} style={styles.logo} contentFit="contain" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
});

export default Onboarding1;

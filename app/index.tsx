import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { images } from "../constants";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "expo-router";

type Nav = {
  navigate: (value: string) => void;
};

const Onboarding1 = () => {
  const { navigate } = useNavigation<Nav>();

  // Add useEffect
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("(tabs)");
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.area}>
      <StatusBar hidden />
      <Image source={images.loading} style={styles.logo} contentFit="contain" />
    </View>
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

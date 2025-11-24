import React, { useEffect } from "react";
import { Text, ImageBackground, StyleSheet } from "react-native";
import { COLORS, images } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
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
    <ImageBackground
      source={images.onboardingSplash}
      style={[styles.area, { direction: "rtl" }]}
    >
      <StatusBar hidden />
      <LinearGradient
        // background linear gradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.background}
      >
        <Text style={styles.greetingText}>أهلًا وسهلًا بك في</Text>
        <Text style={styles.logoName}>حالا!👋</Text>
        <Text style={styles.subtitle}>
          كل طلب توصله؟ حالا توصّله أسرع. تطبيق واحد، حلول شاملة للتوصيل والشحن،
          بخدمة ولا أروع!
        </Text>{" "}
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  background: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    height: 270,
    paddingHorizontal: 16,
  },
  greetingText: {
    fontSize: 40,
    color: COLORS.white,
    fontFamily: "bold",
    marginVertical: 12,
  },
  logoName: {
    fontSize: 76,
    color: COLORS.primary,
    fontFamily: "extraBold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 12,
    fontFamily: "semiBold",
  },
});

export default Onboarding1;

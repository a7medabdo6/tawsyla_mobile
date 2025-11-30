import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import { COLORS, icons, SIZES } from "@/constants";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { useLanguageContext } from "@/contexts/LanguageContext";

function LoginCard({ text }: any) {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();

  return (
    <View style={styles.loginCard}>
      <Image
        source={icons.userDefault as any}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.loginText}>
        {text ? t(`${text}`) : t("You must login to view your cart")}
      </Text>
      <Button
        title={t("Login")}
        filled
        style={styles.loginBtn}
        onPress={() => navigation.navigate("login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  loginCard: {
    // backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    width: SIZES.width - 32,
    flex: 1,
    alignSelf: "center",
  },
  loginText: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  loginBtn: {
    width: 160,
    borderRadius: 30,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 16,
    tintColor: COLORS.primary,
  },
  // ...existing styles...
});
export default LoginCard;

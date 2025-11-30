import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
} from "react-native";
import Button from "./Button";
import { COLORS, icons, SIZES } from "@/constants";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface NoDataFoundProps {
  title?: string;
  subtitle?: string;
  icon?: ImageSourcePropType;
  buttonText?: string;
  onButtonPress?: () => void;
  showButton?: boolean;
}

function NoDataFound({
  title,
  subtitle,
  icon,
  buttonText,
  onButtonPress,
  showButton = true,
}: NoDataFoundProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();

  const defaultTitle = t("No data found");
  const defaultButtonText = t("Home");
  const defaultIcon = icons.userDefault as ImageSourcePropType;

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      navigation.navigate("index");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <View style={styles.iconContainer}>
          <Image
            source={icon || defaultIcon}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.loginText}>{title || defaultTitle}</Text>

        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}

        {showButton && (
          <Button
            title={buttonText || defaultButtonText}
            filled
            style={styles.loginBtn}
            onPress={handleButtonPress}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loginCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    width: SIZES.width - 32,
    alignSelf: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    width: 48,
    height: 48,
    tintColor: COLORS.primary,
  },
  loginText: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray3,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  loginBtn: {
    width: 160,
    borderRadius: 30,
    marginTop: 16,
  },
});

export default NoDataFound;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { SIZES, COLORS, icons } from "../constants";
import { NavigationProp } from "@react-navigation/native";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLORS.white,
          justifyContent: "space-between",
        },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={icons.back as ImageSourcePropType}
          contentFit="contain"
          style={styles.backIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  } as ImageStyle,
  title: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  } as TextStyle,
});

export default Header;

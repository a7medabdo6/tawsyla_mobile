import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SIZES, COLORS } from "../constants";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLORS.white,
        },
      ]}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
      >
        <Ionicons
          name={isRTL ? "chevron-forward" : "chevron-back"}
          size={28}
          color={COLORS.greyscale900}
        />
      </TouchableOpacity>

      {/* Centered Title */}
      <View>
        <Text style={[styles.headerTitle]}>{title}</Text>
      </View>

      {/* Empty view for spacing balance */}
      <View style={styles.rightSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: SIZES.width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 6,
  } as ViewStyle,
  backButton: {
    padding: 4,
    minWidth: 40,
  } as ViewStyle,
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginBottom: 6,
  } as TextStyle,
  rightSpacer: {
    minWidth: 40,
  } as ViewStyle,
});

export default Header;

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
import { SIZES, COLORS, icons ,images} from "../constants";
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
        <TouchableOpacity style={styles.headerContainer}>
        <View style={[styles.headerLeft, ]}>
          <Image
            source={images.logo}
            contentFit='contain'
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900,
            marginLeft: isRTL ? 0 : 12,
            marginRight: isRTL ? 12 : 0
          }]}>{title}</Text>
        </View>
       
      </TouchableOpacity>
      
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  refreshButton: {
    marginRight: 12
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
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

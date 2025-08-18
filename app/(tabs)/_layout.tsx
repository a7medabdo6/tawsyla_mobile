import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons, FONTS, SIZES } from "../../constants";
import { useLanguageContext } from "../../contexts/LanguageContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabLayout = () => {
  const { t, isRTL } = useLanguageContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== "ios",
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? 90 : 110,
          // backgroundColor: COLORS.white,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Image
                  source={focused ? icons.home4 : icons.home4Outline}
                  contentFit="contain"
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                  }}
                />
                {/* <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                >
                  {t("tabs.home")}
                </Text> */}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="fav"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={35}
                  style={{
                    width: 35,
                    height: 35,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                  color="black"
                />
                {/* <Image
                  source={focused ? icons.document : icons.documentOutline}
                  contentFit="contain"
                 
                /> */}
                {/* <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                >
                  {t("tabs.myOrder")}
                </Text> */}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="createorder"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Ionicons
                  style={{
                    width: 35,
                    height: 35,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                  name="add-circle-outline"
                  size={35}
                  color="black"
                />
                {/* <Image
                  source={focused ? icons.document : icons.documentOutline}
                  contentFit="contain"
                /> */}
                {/* <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                >
                  {t("tabs.myOrder")}
                </Text> */}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Ionicons
                  name="cart-outline"
                  size={35}
                  style={{
                    width: 35,
                    height: 35,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                  color="black"
                />

                {/* <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                >
                  {t("tabs.inbox")}
                </Text> */}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Ionicons
                  name="settings-outline"
                  style={{
                    width: 35,
                    height: 35,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                  size={35}
                  color="black"
                />

                {/* <Text
                  style={{
                    ...FONTS.body4,
                    color: focused ? COLORS.primary : COLORS.gray3,
                  }}
                >
                  {t("tabs.profile")}
                </Text> */}
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

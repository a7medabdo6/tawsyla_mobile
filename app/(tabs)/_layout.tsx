import { Tabs } from "expo-router";
import { View, Text, Platform, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "../../constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCart } from "@/data/useCart";
import CustomTabBar from "@/components/CustomTabBar";
import { useFavourites } from "@/data/useFavourites";

const TabLayout = () => {
  const { data: cartItems } = useCart();
  const { data: favItems } = useFavourites();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== "ios",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={focused ? icons.home4 : icons.home4Outline}
              contentFit="contain"
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="fav"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused, color }) => (
            <View>
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={color}
              />
              {favItems?.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {favItems?.length > 9 ? "9+" : favItems?.length}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="createorder"
        options={{
          title: "Order",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused, color }) => (
            <View>
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={24}
                color={color}
              />
              {cartItems?.totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItems?.totalItems > 9 ? "9+" : cartItems?.totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default TabLayout;

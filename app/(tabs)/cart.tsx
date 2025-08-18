import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  StatusBar,
  ImageSourcePropType,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, icons, images, SIZES } from "@/constants";
import { FromMeRoute, ToMeRoute } from "@/tabs";
import ProductCardHorizintal from "@/components/ProductHorizintal";
import { useCart } from "@/data/useCart";
import { useFocusEffect } from "expo-router";
const orange = require("../../assets/images/orange.png");

const renderScene = SceneMap({
  first: FromMeRoute,
  second: ToMeRoute,
});

const Cart = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "From Me" },
    { key: "second", title: "To Me" },
  ]);

  const { data, isLoading, error, refetch } = useCart();
  const items = data?.items || [];

  // Refetch cart data each time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );



  /**
   * render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo as ImageSourcePropType}
            resizeMode="contain"
            style={styles.headerLogo}
          />
          <Text
            style={[
              styles.headerTitle,
              {
                color: COLORS.greyscale900,
              },
            ]}
          >
            السلة
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Image
              source={icons.moreCircle as ImageSourcePropType}
              resizeMode="contain"
              style={[
                styles.moreCircleIcon,
                {
                  tintColor: COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, direction: "rtl" }}
    >
      <StatusBar hidden={true} />
      <View style={{ flex: 1, backgroundColor: COLORS.paleGreen }}>
        {renderHeader()}
        <View style={{ flex: 1, alignItems: "center", marginBottom: 70 }}>
          {isLoading ? (
            <Text style={{ marginTop: 20 }}>Loading...</Text>
          ) : error ? (
            <Text style={{ marginTop: 20 }}>Failed to load cart</Text>
          ) : (
            <FlatList
              contentContainerStyle={{
                // backgroundColor: "red",
                width: "100%",
                padding: 0,
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              data={items}
              keyExtractor={(item: any, index) => item.id || item.productId || String(index)}
              renderItem={({ item }: any) => {
                const name = item?.productNameAr || item?.productNameEn || "";
                const price = item?.unitPrice || 0;
                const rating = 4; // Default rating since it's not in the API response
                const imagePath = item?.image?.path;
                const imageSource = imagePath ? { uri: `http://10.0.2.2:4000${imagePath}` } : orange;
                return (
                  <ProductCardHorizintal
                    icon="hearto"
                    name={name}
                    iconColor={COLORS.red}
                    image={imageSource as any}
                    price={String(price)}
                    rating={rating}
                    itemId={item.id}
                    quantity={item.quantity}
                  />
                );
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    height: 36,
    width: 36,
    tintColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12,
  },
});
export default Cart;

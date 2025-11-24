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
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, icons, images, SIZES } from "@/constants";
import { FromMeRoute, ToMeRoute } from "@/tabs";
import ProductCardHorizintal from "@/components/ProductHorizintal";
import { useCart } from "@/data/useCart";
import { useFocusEffect, useNavigation } from "expo-router";
import Button from "@/components/Button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { NavigationProp } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import LoginCard from "@/components/LoginCard";
import NoDataFound from "@/components/NoDataFound";
import EmptyCart from "@/components/EmptyCart";
const orange = require("../../assets/images/orange.png");

const renderScene = SceneMap({
  first: FromMeRoute,
  second: ToMeRoute,
});

const Cart = () => {
  const layout = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<any>>();

  const [routes] = React.useState([
    { key: "first", title: "From Me" },
    { key: "second", title: "To Me" },
  ]);

  const { data, isLoading, error, refetch } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const items = data?.items || [];
  const { t, isRTL } = useLanguageContext();

  // Refetch cart data each time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );
  // Function to sum total price
  const sumPrices = (items: any) => {
    return items.reduce((total: any, item: any) => {
      // Parse totalPrice to float and add to running total
      return total + parseFloat(item.totalPrice);
    }, 0);
  };
  useEffect(() => {
    if (items?.length > 0) {
      setTotalPrice(sumPrices(items));
    }
  }, [data]);

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
          {/* <TouchableOpacity>
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
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, direction: "rtl" }}
    >
      <StatusBar hidden={true} />
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        {renderHeader()}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginBottom: 70,
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              {data?.statusCode == 401 ? (
                <NoDataFound />
              ) : (
                <>
                  {data?.items?.length === 0 && <EmptyCart />}
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
                    data={[...items]} // Duplicate items to simulate more data
                    keyExtractor={(item: any, index) =>
                      item.id || item.productId || String(index)
                    }
                    renderItem={({ item }: any) => {
                      console.log(item,"ttttttttt");
                      
                      const name =
                        item?.productNameAr || item?.productNameEn || "";
                      const price = item?.unitPrice || 0;
                      const rating = item?.rating || 4; // Default rating since it's not in the API response
                      const imagePath = item?.image?.path;
                      const imageSource = imagePath
                        ? { uri: `http://159.65.75.17:3000/api/v1/files${imagePath}` }
                        : orange;
                      return (
                        <ProductCardHorizintal
                          icon="hearto"
                          name={name}
                          iconColor={COLORS.red}
                          image={imageSource as any}
                          price={String(price)}
                          rating={rating}
                          itemId={item.id}
                          productId={item.productId}
                          description={item.descriptionAr}
                          quantity={item.quantity}
                        />
                      );
                    }}
                  />
                  {data?.items?.length > 0 && (
                    <View style={{ alignItems: "center" }}>
                      <Button
                        title={t("Complete Order")}
                        filled
                        style={styles.continueBtn}
                        onPress={() =>
                          navigation.navigate("checkout", {
                            totalPrice,
                          })
                        }
                        // onPress={() => paymentMethodBottomSheet.current.open()}
                      />
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  continueBtn: {
    borderRadius: 30,
    marginTop: 22,

    width: SIZES.width - 32,
  },
  serviceSubtitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
  },
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

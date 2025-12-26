import {
  View,
  Text,
  Image,
  StatusBar,
  ImageSourcePropType,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, icons, images, SIZES } from "@/constants";
import ProductCardHorizintal from "@/components/ProductHorizintal";
import { useCart } from "@/data/useCart";
import { useFocusEffect, useNavigation } from "expo-router";
import Button from "@/components/Button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { NavigationProp } from "@react-navigation/native";
import LoginCard from "@/components/LoginCard";
import NoDataFound from "@/components/NoDataFound";
import { useAuthStatus } from "@/data";
import TabScreenWrapper from "@/components/TabScreenWrapper";
import CartSkeleton from "@/components/CartSkeleton";
const orange = require("../../assets/images/orange.png");

const Cart = () => {
  const { data: authData } = useAuthStatus();
  const navigation = useNavigation<NavigationProp<any>>();

  const { data, isLoading, refetch } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const items = data?.items || [];
  const { t } = useLanguageContext();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <View style={styles.headerRight}></View>
      </View>
    );
  };

  return (
    <TabScreenWrapper>
      <StatusBar hidden={true} />
      <View
        style={{
          flex: 1,
          direction: "rtl",
          paddingHorizontal: 16,
          backgroundColor: "#fff",
        }}
      >
        {renderHeader()}
        <View
          style={{
            flex: 1,
            marginBottom: 60,
            height: "100%",
            width: "100%",
          }}
        >
          {!authData?.user ? (
            <LoginCard text={"You must login to view your Cart"} />
          ) : isLoading ? (
            <CartSkeleton />
          ) : (
            <>
              {data?.statusCode === 401 ? (
                <NoDataFound
                  title="السلة فارغة"
                  subtitle="أضف منتجات إلى سلة التسوق للمتابعة"
                  buttonText="تصفح المنتجات"
                  icon={icons.shopping as any}
                  onButtonPress={() => navigation.navigate("allproducts")}
                />
              ) : (
                <>
                  {items.length === 0 ? (
                    <NoDataFound
                      title="السلة فارغة"
                      subtitle="أضف منتجات إلى سلة التسوق للمتابعة"
                      buttonText="تصفح المنتجات"
                      icon={icons.shopping as any}
                      onButtonPress={() => navigation.navigate("allproducts")}
                    />
                  ) : (
                    <>
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                          width: "100%",
                          paddingBottom: 20,
                        }}
                        data={items}
                        keyExtractor={(item: any, index) =>
                          item.id || item.productId || String(index)
                        }
                        renderItem={({ item }: any) => {
                          const name =
                            item?.productNameAr || item?.productNameEn || "";
                          const price = item?.unitPrice || 0;
                          const rating = item?.rating || 4;
                          const imagePath = item?.image?.path;
                          const imageSource = imagePath
                            ? {
                                uri: `https://api.waslha.net/api/v1/files${imagePath}`,
                              }
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
                      <View
                        style={{
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Button
                          title={`${t("Complete Order")} (${totalPrice.toFixed(
                            2
                          )} ج.م)`}
                          filled
                          style={styles.continueBtn}
                          onPress={() =>
                            navigation.navigate("checkout", {
                              totalPrice,
                            })
                          }
                        />
                      </View>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    </TabScreenWrapper>
  );
};

const styles = StyleSheet.create({
  continueBtn: {
    borderRadius: 30,
    marginTop: 5,
    width: SIZES.width - 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.84,
    elevation: 4,
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
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    height: 36,
    width: 36,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginHorizontal: 12,
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

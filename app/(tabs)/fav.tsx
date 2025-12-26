import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { COLORS, icons, images } from "@/constants";
import ProductCardHorizintal from "@/components/ProductHorizintal";
import { useFavourites } from "@/data/useFavourites";
import { useFocusEffect, useNavigation } from "expo-router";
import NoDataFound from "@/components/NoDataFound";
import LoginCard from "@/components/LoginCard";
import TabScreenWrapper from "@/components/TabScreenWrapper";
import FavouritesSkeleton from "@/components/FavouritesSkeleton";
import { NavigationProp } from "@react-navigation/native";
const orange = require("../../assets/images/orange.png");

const Fav = () => {
  const navigation = useNavigation<NavigationProp<any>>();

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
            المفضلة
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

  const { data, isLoading, refetch } = useFavourites();
  const items = data?.items || data?.data || data || [];

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <TabScreenWrapper>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          direction: "rtl",
        }}
      >
        {renderHeader()}

        {!isLoading && data?.items?.length > 0 && (
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>
              لديك {data.items.length} منتج في المفضلة
            </Text>
          </View>
        )}

        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginBottom: 70,
            marginTop: 8,
          }}
        >
          {isLoading ? (
            <FavouritesSkeleton />
          ) : (
            <>
              {data?.statusCode === 401 ? (
                <LoginCard text={"You must login to view your Favourite"} />
              ) : (
                <>
                  {items.length === 0 ? (
                    <NoDataFound
                      title="لا توجد منتجات في المفضلة"
                      subtitle="ابدأ بإضافة منتجاتك المفضلة لتسهيل الوصول إليها لاحقاً"
                      buttonText="تصفح المنتجات"
                      icon={icons.heart2 as any}
                      onButtonPress={() => navigation.navigate("allproducts")}
                    />
                  ) : (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        width: "100%",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: 20,
                      }}
                      data={Array.isArray(items) ? items : []}
                      keyExtractor={(item: any, index) =>
                        item?.id || item?.productId || String(index)
                      }
                      renderItem={({ item }: any) => {
                        const name =
                          item?.product?.productNameAr ||
                          item?.product?.productNameEn ||
                          item?.product?.nameAr ||
                          item?.product?.nameEn ||
                          item?.product?.name ||
                          "";
                        const price =
                          item?.product?.unitPrice ||
                          item?.product?.price ||
                          item?.product?.variants?.[0]?.price ||
                          0;
                        const rating = item?.product?.rating || 4;
                        const imagePath =
                          item?.product?.image?.path ||
                          item?.product?.imagePath;
                        const imageSource = imagePath
                          ? {
                              uri: `http://159.65.75.17:3000/api/v1/files${imagePath}`,
                            }
                          : orange;
                        return (
                          <ProductCardHorizintal
                            icon="heart"
                            name={name}
                            image={imageSource as any}
                            price={String(price)}
                            rating={rating}
                            description={
                              item?.product?.descriptionAr ||
                              item?.product?.descriptionEn
                            }
                            productId={item?.product?.id || item?.id}
                          />
                        );
                      }}
                    />
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
  subtitleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.gray3,
    fontWeight: "500",
    textAlign: "right",
  },
});

export default Fav;

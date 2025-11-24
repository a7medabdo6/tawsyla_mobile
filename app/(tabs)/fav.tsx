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
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, icons, images, SIZES } from "@/constants";
import { FromMeRoute, ToMeRoute } from "@/tabs";
import ProductCardHorizintal from "@/components/ProductHorizintal";
import { useFavourites } from "@/data/useFavourites";
import { useFocusEffect } from "expo-router";
import NoDataFound from "@/components/NoDataFound";
import LoginCard from "@/components/LoginCard";
import Header from "@/components/Header";
const orange = require("../../assets/images/orange.png");

const renderScene = SceneMap({
  first: FromMeRoute,
  second: ToMeRoute,
});

const Fav = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "From Me" },
    { key: "second", title: "To Me" },
  ]);

  const { data, isLoading, error, refetch } = useFavourites();
  const items = data?.items || data?.data || data || [];

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );



  /**
   * render header
   */
  

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, direction: "rtl" }}
    >
      <View style={{ flex: 1, backgroundColor: COLORS.white, padding: 16 }}>
        <Header 
          title="المفضلة"
          // isRTL={isRTL}
          // onBackPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1, alignItems: "center", marginBottom: 70 ,marginTop: 16}}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              {data?.statusCode == 401 ? (
                <LoginCard text={"You must login to view your Favourite"} />
              ) : (
                <>
                  {data?.items?.length === 0 && <NoDataFound />}
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
                    data={Array.isArray(items) ? items : []}
                    keyExtractor={(item: any, index) =>
                      item?.id || item?.productId || String(index)
                    }
                    renderItem={({ item }: any) => {
                      console.log(item.product.variants,"pppppppp");
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
                      const imagePath = item?.product?.image?.path || item?.product?.imagePath;
                      const imageSource = imagePath
                        ? { uri: `http://159.65.75.17:3000/api/v1/files${imagePath}` }
                        : orange;
                      return (
                        <ProductCardHorizintal
                          icon="heart"
                          name={name}
                          image={imageSource as any}
                          price={String(price)}
                          rating={rating}
                          description={item?.product?.descriptionAr || item?.product?.descriptionEn}
                          productId={item?.product?.id || item?.id}
                        />
                      );
                    }}
                  />
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
export default Fav;

import { COLORS } from "@/constants";
import { useCategories, useProducts } from "@/data/useHome";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  I18nManager,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ProductCard from "./Product";
import Skeleton from "./Skeleton";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = 130;
const SPACING = 12;

const ProductHomeList = () => {
  const [active, setActive] = useState("1");
  // Reverse data for RTL, because react-native-reanimated-carousel doesn't have inverted prop
  const { data, isLoading, error } = useProducts(1, 10); // Show first 8 products on home
  // console.log(data, "datadatadatadataaaaa");

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {[1, 2, 3, 4].map((key) => (
            <View key={key} style={{ width: "48%", marginBottom: 16 }}>
              <Skeleton height={180} borderRadius={16} />
              <View style={{ marginTop: 8 }}>
                <Skeleton width="80%" height={16} />
                <Skeleton width="40%" height={16} style={{ marginTop: 4 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (error) return <Text>Error: {error.message}</Text>;

  const renderItem = ({ item }: any) => (
    <ProductCard
      name={item?.nameAr || item?.nameEn}
      image={
        item.image?.path
          ? `https://api.waslha.net/api/v1/files${item.image.path}`
          : undefined
      }
      price="2.99"
      rating={item?.rating}
      style={{ width: "45%" }}
      varints={item?.variants}
      productId={item?.id}
    />
  );
  return (
    <View style={styles.container}>
      <View style={{ direction: "ltr" }}>
        <FlatList
          numColumns={2}
          data={data?.data || []}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            // paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          inverted={false}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default ProductHomeList;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    // backgroundColor:"red"
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 2,
    marginBottom: 12,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: "#fff",
    // borderRadius: 16,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingVertical: 5,
    paddingLeft: 12,
    alignItems: "center",
    marginRight: SPACING,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    // shadowOpacity: 0.01,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 2,
    // elevation: 30,
  },
  iconContainer: {
    backgroundColor: "#E9F5EF",
    padding: 8,
    borderRadius: 50,
    // marginBottom: 8,
    marginHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  label: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

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
import { useCart } from "@/data/useCart";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = 130;
const SPACING = 12;

const ProductHomeList = () => {
  const [active, setActive] = useState("1");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const { data: cartItems } = useCart();
  const { data, isLoading, error, isFetching } = useProducts(page, 10);

  // Update products list when new data arrives
  React.useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        // Reset list for first page
        setAllProducts(data.data);
      } else {
        // Append new products for subsequent pages
        setAllProducts((prev) => [...prev, ...data.data]);
      }
      
      // Check if there are more products to load
      if (data.data.length < 10) {
        setHasMore(false);
      }
    }
  }, [data, page]);

  if (isLoading && page === 1) {
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

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

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
      style={{ width: "48%" }}
      varints={item?.variants}
      productId={item?.id}
      cartItem={cartItems?.items?.find((cartItem: any) => cartItem.productId === item?.id)}
    />
  );
  return (
    <View style={styles.container}>
      <View style={{ direction: "ltr" }}>
        <FlatList
          numColumns={2}
          data={allProducts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          inverted={false}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "medium",
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

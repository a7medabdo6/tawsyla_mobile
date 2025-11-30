import { COLORS, icons } from "@/constants";
import { useCategories } from "@/data/useHome";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  I18nManager,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = 130;
const SPACING = 12;

import Skeleton from "./Skeleton";

const CategoryCarousel = () => {
  const [active, setActive] = useState("");
  const { data, isLoading, error } = useCategories({ limit: 4 });
  const navigation = useNavigation<any>();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[1, 2, 3].map((key) => (
            <View key={key} style={{ width: "32%", marginBottom: 16 }}>
              <Skeleton height={210} borderRadius={16} />
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (error) return <Text>Error: {error.message}</Text>;
  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => {
        // Navigate to products filtered by this category
        router.push({
          pathname: "/allproducts",
          params: {
            categoryId: item.id,
            categoryName: item.nameAr || item.nameEn,
          },
        });
      }}
    >
      <View style={styles.categoryIconContainer}>
        {item.image?.path ? (
          <Image
            source={{ uri: `http://159.65.75.17:3000${item.image?.path}` }}
            contentFit="cover"
            style={styles.categoryImage}
          />
        ) : (
          <Image
            source={icons.sample}
            contentFit="cover"
            style={styles.categoryImage}
          />
        )}
      </View>
      <Text style={styles.categoryName}>{item.nameAr || item.nameEn}</Text>
      {/* <Text style={styles.categoryDescription}>
        {item.descriptionAr || item.descriptionEn || "لا يوجد وصف"}
      </Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          numColumns={3}
          renderItem={renderCategory}
        />
      </View>
    </View>
  );
};

export default CategoryCarousel;

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 2,
    // marginBottom: 12,
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
    borderColor: COLORS?.paleGreenDark,
    borderWidth: 1,
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
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    width: 50,
  },
  categoryCard: {
    flex: 1, // Take all available space in the column
    minWidth: 0, // Fix text overflow issues
    height: 210,
    // backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingBottom: 10,
    paddingTop: 5,
    paddingHorizontal: 3,
    marginLeft: 3,
    marginVertical: 5,
    alignItems: "center",
    position: "relative",
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // borderColor:COLORS.paleGreenDark,
    // borderWidth :1
  },
  categoryIconContainer: {
    backgroundColor: COLORS.paleGreen,
    borderRadius: 16,
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    tintColor: COLORS.primary,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 16,
  },
  categoryName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    width: "100%",
    paddingRight: 5,
    color: COLORS.black,
    textAlign: "center",
    position: "absolute",
    top: 15,
    left: 0,
    right: 0,
  },
  categoryDescription: {
    fontSize: 12,
    color: COLORS.gray,
    width: "100%",
    paddingRight: 5,
    textAlign: "center",
  },
});

import { COLORS } from "@/constants";
import { useCategories, useMasterCategories } from "@/data/useHome";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
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

const { width } = Dimensions.get("window");

import Skeleton from "./Skeleton";

const MasterCategory = () => {
  const [active, setActive] = useState("");
  // Reverse data for RTL, because react-native-reanimated-carousel doesn't have inverted prop
  const { data, isLoading, error } = useMasterCategories();
  const navigation = useNavigation<any>();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[1, 2, 3, 4].map((key) => (
            <View key={key} style={{ width: (width - 48) / 2, margin: 4 }}>
              <Skeleton height={60} borderRadius={50} />
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (error) return <Text>Error: {error.message}</Text>;

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("allcategories", {
          masterId: item?.id,
          masterName: item.nameAr || item.nameEn,
        })
      }
      style={[
        styles.card,
        {
          backgroundColor: active == item?.id ? COLORS.primary : COLORS.white,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active == item?.id ? COLORS.white : "" },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.nameAr || item.nameEn}
      </Text>

      <View style={styles.iconContainer}>
        <Image
          source={{
            uri: `https://api.waslha.net/api/v1/files${item.image?.path}`,
          }}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={data}
          // showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            // paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "center",
          }}
          // inverted={true}
          numColumns={2}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default MasterCategory;

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
    width: (width - 48) / 2,
    backgroundColor: "#fff",
    // borderRadius: 16,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingVertical: 5,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    borderColor: COLORS?.paleGreenDark,
    borderWidth: 1,
    margin: 4,
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
    width: 100,
  },
});

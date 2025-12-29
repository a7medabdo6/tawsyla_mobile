import { COLORS } from "@/constants";
import { useLanguageContext } from "@/contexts/LanguageContext";
import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const OrderTable = ({ data }: any) => {
  const { t, isRTL } = useLanguageContext();

  const renderItem = ({ item, index }: any) => (
    <View style={[styles.row, index === data?.length - 1 && styles.lastRow]}>
      <View style={styles.imageCell}>
        <Image
          source={{
            uri: `https://api.waslha.net/api/v1/files${item.product?.image?.path}`,
          }}
          style={styles.image}
        />
      </View>
      <Text style={styles.itemNameCell} numberOfLines={2}>
        {item.product?.nameAr}
      </Text>
      <View style={styles.quantityCell}>
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{item.quantity}</Text>
        </View>
      </View>
      <Text style={styles.priceCell}>
        {(item.variant?.price * item.quantity).toFixed(2)} {t("EGP")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 0.8 }]}>
          {t("Image")}
        </Text>
        <Text style={styles.headerCell}>{t("Item")}</Text>
        <Text style={styles.headerCell}>{t("Qty")}</Text>
        <Text style={styles.headerCell}>{t("Total")}</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    borderRadius: 12,
    overflow: "hidden",
    direction: "rtl",
    backgroundColor: COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: COLORS.grayscale200,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  imageCell: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
  },
  itemNameCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "medium",
    color: COLORS.black,
    paddingHorizontal: 4,
  },
  quantityCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityBadge: {
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  priceCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default OrderTable;

import { COLORS } from "@/constants";
import { useLanguageContext } from "@/contexts/LanguageContext";
import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const OrderTable = ({ data }: any) => {
  const { t, isRTL } = useLanguageContext();

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <View style={styles.imageCell}>
        <Image
          source={{ uri: `http://159.65.75.17:3000/api/v1/files${item.product?.image?.path}` }}
          style={styles.image}
        />
      </View>
      <Text style={styles.cell}>{item.product?.nameAr}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={styles.cell}>
        {(item.variant?.price * item.quantity).toFixed(2)} {t("EGP")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell, { flex: 0.8 }]}>
          {t("Image")}
        </Text>
        <Text style={[styles.cell, styles.headerCell]}>{t("Item")}</Text>
        <Text style={[styles.cell, styles.headerCell]}>{t("Qty")}</Text>
        <Text style={[styles.cell, styles.headerCell]}>{t("Total")}</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // margin: 16,
    borderWidth: 1,
    borderColor: COLORS.paleGreenDark,
    borderRadius: 6,
    overflow: "hidden",
    direction: "rtl",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: COLORS.paleGreenDark,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerRow: {
    backgroundColor: COLORS.paleGreen,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
  },
  imageCell: {
    flex: 0.8,
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 4,
  },
});

export default OrderTable;

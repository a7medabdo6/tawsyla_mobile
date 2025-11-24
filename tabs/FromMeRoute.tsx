import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, icons } from "../constants";
import { NavigationProp } from "@react-navigation/native";
import { outgoingShipments } from "@/data";
import { useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { OrderStatus } from "@/app/myordertrack";
import moment from "moment";
import { SimpleLineIcons } from "@expo/vector-icons";
const ORDER_STATUS_STEPS = [
  {
    key: OrderStatus.PENDING,
    label: { en: "Pending", ar: "قيد الانتظار" },
    estimation: { en: "Awaiting confirmation", ar: "بانتظار التأكيد" },
  },
  {
    key: OrderStatus.CONFIRMED,
    label: { en: "Confirmed", ar: "تم التأكيد" },
    estimation: { en: "Order confirmed", ar: "تم تأكيد الطلب" },
  },
  {
    key: OrderStatus.PROCESSING,
    label: { en: "Processing", ar: "جارٍ المعالجة" },
    estimation: { en: "Preparing your order", ar: "يتم تجهيز طلبك" },
  },
  {
    key: OrderStatus.SHIPPED,
    label: { en: "Shipped", ar: "تم الشحن" },
    estimation: { en: "Out for delivery", ar: "في طريقه للتوصيل" },
  },
  {
    key: OrderStatus.DELIVERED,
    label: { en: "Delivered", ar: "تم التوصيل" },
    estimation: { en: "Order delivered", ar: "تم توصيل الطلب" },
  },
  {
    key: OrderStatus.CANCELLED,
    label: { en: "Cancelled", ar: "تم الإلغاء" },
    estimation: { en: "Order cancelled", ar: "تم إلغاء الطلب" },
  },
  {
    key: OrderStatus.REFUNDED,
    label: { en: "Refunded", ar: "تم الاسترداد" },
    estimation: { en: "Order refunded", ar: "تم استرداد الطلب" },
  },
];
const OrderCard = ({ item }: any) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return COLORS.card;
      case OrderStatus.CONFIRMED:
        return COLORS.primary;
      case OrderStatus.PROCESSING:
        return COLORS.primary;
      case OrderStatus.SHIPPED:
        return COLORS.primary;
      case OrderStatus.DELIVERED:
        return COLORS.primary;
      case OrderStatus.CANCELLED:
        return COLORS.red;
      case OrderStatus.REFUNDED:
        return COLORS.primary;
    }
  };
  return (
    <View style={styles.itemContainer}>
      <View style={styles.statusContainer}></View>
      <View style={styles.infoContainer}>
        <View style={styles.infoLeft}>
          {/* <Image
            source={icons.package2}
          /> */}
          <SimpleLineIcons
            style={[styles.itemImage]}
            name="bag"
            size={50}
            color={COLORS.primary}
          />
          <View style={styles.itemDetails}>
            <Text
              style={[
                styles.itemName,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {item?.orderNumber}
            </Text>
            <View style={styles.itemSubDetails}>
              <View style={styles.itemPriceContainer}>
              <Text style={styles.itemPrice}>
                {item?.total} {t("EGP")}
              </Text>
                <Text
                style={[
                  styles.itemItems,
                  {
                    color: COLORS.grayscale700,
                    marginHorizontal: 5,
                  },
                ]}
              >
                {" "}
               ({ item?.items?.length}) {t("Items")}
              </Text>
              </View>


             
              <Text
                style={[
                  styles.itemDate,
                  {
                    color: COLORS.grayscale700,
                  },
                ]}
              >
                {" "}
                {moment(item?.createdAt).format("YYYY-MM-DD")}
              </Text>
             
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.statusText,
            {
              color: statusColor(item?.status),
              // marginLeft: 12,
            },
          ]}
        >
          {isRTL
            ? ORDER_STATUS_STEPS?.find((sub) => sub.key == item?.status)?.label
                ?.ar
            : ORDER_STATUS_STEPS?.find((sub) => sub.key == item?.status)?.label
                ?.en}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("orderDetail", {
              orderId: item?.id,
            })
          }
          style={styles.rateButton}
        >
          <Text style={styles.rateButtonText}>{t("View")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("myordertrack", {
              orderId: item?.id,
            })
          }
          style={styles.reorderButton}
        >
          <Text style={styles.reorderButtonText}>{t("Track Order")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "column",
  },
  statusContainer: {
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: 0.4,
    marginVertical: 12,
    flexDirection: "row",
    paddingBottom: 4,
  },
  itemPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginHorizontal: 5,
  },
  typeText: {
    fontSize: 14,
    fontFamily: "bold",
  },
  statusText: {
    fontSize: 14,
    fontFamily: "bold",
    // marginHorizontal: 5,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  itemImage: {
    height: 50,
    width: 50,
    borderRadius: 8,
  },
  itemDetails: {
    marginHorizontal: 12,
    width: "100%",
    // backgroundColor: "red",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemSubDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: "space-between",
    width: "100%",
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  itemDate: {
    fontSize: 12,
    fontFamily: "regular",
    // marginHorizontal: 5,
    
  },
  itemItems: {
    fontSize: 12,
    fontFamily: "regular",
  },
  receiptText: {
    fontSize: 14,
    textDecorationLine: "underline",
    textDecorationColor: COLORS.gray,
    fontFamily: "regular",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 18,
  },
  rateButton: {
    height: 38,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
  },
  rateButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "regular",
  },
  reorderButton: {
    height: 38,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  reorderButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "regular",
  },
});

export default OrderCard;

import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants";
import { NavigationProp } from "@react-navigation/native";
import { outgoingShipments } from "@/data";
import { useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { OrderStatus } from "@/app/myordertrack";
import moment from "moment";
import OrderCard from "@/components/OrderCard";

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

const FromMeRoute = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return COLORS.card;
      case OrderStatus.CONFIRMED:
      case OrderStatus.PROCESSING:
      case OrderStatus.SHIPPED:
      case OrderStatus.DELIVERED:
      case OrderStatus.REFUNDED:
        return COLORS.primary;
      case OrderStatus.CANCELLED:
        return COLORS.red;
      default:
        return COLORS.primary;
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const statusLabel = isRTL
      ? ORDER_STATUS_STEPS?.find((sub) => sub.key === item?.status)?.label?.ar
      : ORDER_STATUS_STEPS?.find((sub) => sub.key === item?.status)?.label?.en;

    return (
      <OrderCard
        index={index}
        title={item?.orderNumber}
        subtitle={`${moment(item?.createdAt).format("YYYY-MM-DD")} • ${
          item?.items?.length
        } ${t("Items")}`}
        price={`${item?.total} ${t("EGP")}`}
        status={statusLabel}
        statusColor={statusColor(item?.status)}
        icon="bag"
        onPress={() =>
          navigation.navigate("orderDetail", {
            orderId: item?.id,
          })
        }
        actions={
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("orderDetail", {
                  orderId: item?.id,
                })
              }
              style={styles.outlineButton}
            >
              <Text style={styles.outlineButtonText}>{t("View")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("myordertrack", {
                  orderId: item?.id,
                })
              }
              style={styles.filledButton}
            >
              <Text style={styles.filledButtonText}>{t("Track Order")}</Text>
            </TouchableOpacity>
          </>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={outgoingShipments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondaryWhite,
  },
  outlineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: "bold",
  },
  filledButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  filledButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "bold",
  },
});

export default FromMeRoute;

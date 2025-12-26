import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import { COLORS, SIZES, icons } from "@/constants";
import { Fontisto } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useOneOrder, useOrderHistory } from "@/data/useOrders";
import moment from "moment";
import Header from "@/components/Header";

// Order status enum
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

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

const MyOrderTrack = () => {
  const { t, isRTL } = useLanguageContext();
  const params = useLocalSearchParams();

  const orderId = params.orderId as string;
  const { data } = useOneOrder(orderId);
  const { data: history } = useOrderHistory(orderId);

  const currentStatus = data?.status;

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusLabel = (status: OrderStatus) => {
    const statusStep = ORDER_STATUS_STEPS.find((step) => step.key === status);
    if (!statusStep) return "";
    return isRTL ? statusStep.label.ar : statusStep.label.en;
  };

  const getStatusEstimation = (status: OrderStatus) => {
    const statusStep = ORDER_STATUS_STEPS.find((step) => step.key === status);
    if (!statusStep) return "";
    return isRTL ? statusStep.estimation.ar : statusStep.estimation.en;
  };

  /**
   * Render order status steps
   */

  const renderOrderStatusSteps = () => {
    if (!history || history.length === 0) {
      return (
        <View style={styles.noHistoryContainer}>
          <Text style={styles.noHistoryText}>
            {isRTL ? "لا يوجد تاريخ حالة متاح" : "No status history available"}
          </Text>
        </View>
      );
    }

    const reversedHistory = [...(history || [])].reverse();

    return (
      <View style={styles.timelineContainer}>
        {reversedHistory.map((step: any, idx: number) => {
          const statusColor = getStatusColor(step?.newStatus || currentStatus);
          const isLast = idx === reversedHistory.length - 1;

          return (
            <View key={step?.id || idx} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineIconContainer,
                    { backgroundColor: statusColor + "20" },
                  ]}
                >
                  <Fontisto
                    name="radio-btn-active"
                    size={20}
                    color={statusColor}
                  />
                </View>
                {!isLast && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeaderRow}>
                  <Text
                    style={[styles.timelineStatusLabel, { color: statusColor }]}
                  >
                    {isRTL
                      ? ORDER_STATUS_STEPS?.find(
                          (item) => item.key === step?.newStatus
                        )?.label?.ar
                      : ORDER_STATUS_STEPS?.find(
                          (item) => item.key === step?.newStatus
                        )?.label?.en}
                  </Text>
                  <Text style={styles.timelineDate}>
                    {moment(step?.createdAt).format("YYYY-MM-DD")}
                  </Text>
                </View>
                <Text style={styles.timelineDescription}>
                  {isRTL
                    ? ORDER_STATUS_STEPS?.find(
                        (item) => item.key === step?.newStatus
                      )?.estimation?.ar
                    : ORDER_STATUS_STEPS?.find(
                        (item) => item.key === step?.newStatus
                      )?.estimation?.en}
                </Text>
                {step?.createdAt && (
                  <Text style={styles.timelineTime}>
                    {moment(step.createdAt).format("HH:mm")}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" },
      ]}
    >
      <Header title={t("Track Order")} />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {/* {renderHeader()} */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.bottomContainer]}>
            {/* Main Order Card - Combined */}
            <View style={styles.mainOrderCard}>
              {/* Current Status */}
              {currentStatus && (
                <View style={styles.currentStatusSection}>
                  <View style={styles.currentStatusHeader}>
                    <View style={styles.statusIndicatorContainer}>
                      <View
                        style={[
                          styles.statusIndicator,
                          {
                            backgroundColor:
                              getStatusColor(currentStatus) + "20",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: getStatusColor(currentStatus) },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.currentStatusInfo}>
                      <Text style={styles.currentStatusLabel}>
                        {getStatusLabel(currentStatus)}
                      </Text>
                      <Text style={styles.currentStatusEstimation}>
                        {getStatusEstimation(currentStatus)}
                      </Text>
                    </View>
                  </View>
                  {data?.createdAt && (
                    <Text style={styles.orderDate}>
                      {moment(data.createdAt).format("YYYY-MM-DD")}
                    </Text>
                  )}
                </View>
              )}

              {/* Order Summary Icons */}
              <View style={styles.summaryViewContainer}>
                <View style={styles.viewItemContainer}>
                  <View style={styles.viewIconContainer}>
                    <Image
                      source={icons.document2 as ImageSourcePropType}
                      resizeMode="contain"
                      style={styles.viewIcon}
                    />
                  </View>
                  <Text
                    style={[styles.viewTitle, { color: COLORS.greyscale900 }]}
                  >
                    {data?.orderNumber || "N/A"}
                  </Text>
                  <Text
                    style={[
                      styles.viewSubtitle,
                      { color: COLORS.grayscale700 },
                    ]}
                  >
                    {t("Order Num")}
                  </Text>
                </View>
                <View style={styles.viewItemContainer}>
                  <View style={styles.viewIconContainer}>
                    <Image
                      source={icons.clockTime as ImageSourcePropType}
                      resizeMode="contain"
                      style={styles.viewIcon}
                    />
                  </View>
                  <Text
                    style={[styles.viewTitle, { color: COLORS.greyscale900 }]}
                  >
                    15 - 30 {t("Min")}
                  </Text>
                  <Text
                    style={[
                      styles.viewSubtitle,
                      { color: COLORS.grayscale700 },
                    ]}
                  >
                    {t("Estimatation")}
                  </Text>
                </View>
                <View style={styles.viewItemContainer}>
                  <View style={styles.viewIconContainer}>
                    <Image
                      source={icons.payment as ImageSourcePropType}
                      resizeMode="contain"
                      style={styles.viewIcon}
                    />
                  </View>
                  <Text
                    style={[styles.viewTitle, { color: COLORS.greyscale900 }]}
                  >
                    {data?.paymentMethod
                      ? t(data.paymentMethod)
                      : t("Cash on Delivery")}
                  </Text>
                  <Text
                    style={[
                      styles.viewSubtitle,
                      { color: COLORS.grayscale700 },
                    ]}
                  >
                    {t("Payment Method")}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.cardDivider} />

              {/* Additional Order Information */}
              <View style={styles.additionalInfoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t("Total")}</Text>
                  <Text style={styles.infoValue}>
                    {data?.total || data?.totalPrice || 0} {t("EGP")}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t("Items")}</Text>
                  <Text style={styles.infoValue}>
                    {data?.items?.length || data?.orderItems?.length || 0}{" "}
                    {t("Items")}
                  </Text>
                </View>
                {data?.createdAt && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t("Date")}</Text>
                    <Text style={styles.infoValue}>
                      {moment(data.createdAt).format("YYYY-MM-DD HH:mm")}
                    </Text>
                  </View>
                )}
              </View>

              {/* Shipping Address */}
              {data?.shippingAddress && (
                <>
                  <View style={styles.cardDivider} />
                  <View style={styles.addressSection}>
                    <View style={styles.addressHeader}>
                      <Image
                        source={icons.location as ImageSourcePropType}
                        resizeMode="contain"
                        style={styles.addressIcon}
                      />
                      <Text style={styles.addressTitle}>{t("Address")}</Text>
                    </View>
                    <Text style={styles.addressText}>
                      {data.shippingAddress.street || ""}
                      {data.shippingAddress.street && data.shippingAddress.city
                        ? ", "
                        : ""}
                      {data.shippingAddress.city || ""}
                      {data.shippingAddress.city && data.shippingAddress.state
                        ? " - "
                        : ""}
                      {data.shippingAddress.state || ""}
                    </Text>
                    {data.shippingAddress.phone && (
                      <Text style={styles.addressPhone}>
                        {t("Phone")}: {data.shippingAddress.phone}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>

            {/* Order Status Timeline */}
            <View style={styles.timelineSection}>
              <Text style={styles.timelineTitle}>
                {isRTL ? "حالة الطلب" : "Order Status"}
              </Text>
              {renderOrderStatusSteps()}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  scrollView: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginHorizontal: 12,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  bottomContainer: {
    paddingBottom: 20,
  },
  mainOrderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
  },
  currentStatusSection: {
    marginBottom: 20,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.greyscale300,
    marginVertical: 16,
  },
  additionalInfoSection: {
    marginTop: 4,
  },
  addressSection: {
    marginTop: 4,
  },
  timelineSection: {
    marginTop: 8,
  },
  btn: {
    width: SIZES.width - 32,
    marginTop: 12,
  },
  locationMapContainer: {
    height: 226,
    width: "100%",
    borderRadius: 12,
    marginVertical: 16,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.dark2,
  },
  viewMapContainer: {
    height: 50,
    backgroundColor: COLORS.gray,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: "auto",
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  bottomTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 22,
  },
  bottomTopTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
  },
  bottomTopSubtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "regular",
  },
  separateLine: {
    height: 0.4,
    width: "100%",
    backgroundColor: COLORS.greyscale300,
    marginVertical: 12,
  },
  addressItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  addressItemLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverInfoContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  driverLeftInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverImage: {
    width: 52,
    height: 52,
    borderRadius: 999,
    marginRight: 12,
  },
  driverName: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 4,
  },
  driverCar: {
    fontSize: 14,
    color: COLORS.grayscale700,
    fontFamily: "regular",
    marginTop: 6,
  },
  driverRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverRightReview: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    height: 14,
    width: 14,
    tintColor: "orange",
    marginRight: 6,
  },
  starNum: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "regular",
  },
  taxiID: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "medium",
    marginTop: 6,
  },
  actionContainer: {
    flexDirection: "row",
    marginTop: 22,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    marginHorizontal: 12,
  },
  actionIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  locationItemContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationIcon1: {
    height: 52,
    width: 52,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  locationIcon2: {
    height: 36,
    width: 36,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  locationIcon3: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  baseLocationName: {
    fontSize: 17,
    color: COLORS.greyscale900,
    fontFamily: "bold",
  },
  baseLocationAddress: {
    fontSize: 14,
    color: COLORS.greyScale800,
    fontFamily: "regular",
    marginTop: 8,
  },
  arrowIconContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  arrowIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black,
  },
  locationDistance: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "medium",
  },
  locationItemRow: {
    flexDirection: "row",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.56)",
  },
  modalSubContainer: {
    height: 520,
    // width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22,
  },
  successBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32,
  },
  receiptBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary,
  },
  editPencilIcon: {
    width: 42,
    height: 42,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 58,
    left: 58,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999,
  },
  happyMood: {
    fontSize: 154,
  },
  orderDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  orderViewContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  orderDetailsTitle: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "85%",
    alignItems: "center",
    // backgroundColor: "red",
    marginBottom: 10,
  },
  orderDetailsSubtitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700,
    marginHorizontal: 10,
  },
  deliveryTime: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.grayscale700,
  },
  orderView: {
    marginLeft: 12,
    width: "100%",
  },
  chatIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
    marginRight: 12,
  },
  phoneIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
    marginLeft: 12,
  },
  summaryViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
    marginBottom: 4,
  },
  viewItemContainer: {
    alignItems: "center",
    flex: 1,
  },
  viewIconContainer: {
    height: 64,
    width: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    marginBottom: 6,
  },
  viewIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
  },
  viewTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 6,
  },
  viewSubtitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    height: 36,
    width: 36,
  },
  currentStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusIndicatorContainer: {
    marginEnd: 12,
  },
  statusIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  currentStatusInfo: {
    flex: 1,
  },
  currentStatusLabel: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 4,
  },
  currentStatusEstimation: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addressIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
    marginEnd: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  addressText: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.greyscale900,
    lineHeight: 20,
    marginBottom: 8,
  },
  addressPhone: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700,
  },
  timelineHeader: {
    marginBottom: 12,
  },
  timelineTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: "center",
    marginEnd: 16,
  },
  timelineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.greyscale300,
    marginTop: 4,
    minHeight: 30,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  timelineStatusLabel: {
    fontSize: 16,
    fontFamily: "bold",
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  timelineDescription: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  noHistoryContainer: {
    padding: 20,
    alignItems: "center",
    marginLeft: 12,
  },
  noHistoryText: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default MyOrderTrack;

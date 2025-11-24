import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import { COLORS, SIZES, icons, images } from "@/constants";
import { NavigationProp } from "@react-navigation/native";
import { Fontisto } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useOneOrder, useOrderHistory } from "@/data/useOrders";
import moment from "moment";

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
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();
  const params = useLocalSearchParams();

  const orderId = params.orderId as string;
  const { data } = useOneOrder(orderId);
  const { data: history } = useOrderHistory(orderId);
  console.log(orderId, "orderIdorderIdorderId");

  const currentStatus = data?.status;

  /**
   * Render header
   */
      const renderHeader = () => {
     return (
       <View style={styles.headerContainer}>
         <View style={styles.headerLeft}>
           <Image
             source={images.logo as ImageSourcePropType}
             resizeMode="contain"
             style={styles.headerLogo}
           />
           <Text
             style={[
               styles.headerTitle,
               {
                 color: COLORS.greyscale900,
               },
             ]}
           >
             {t("Track Order")}
           </Text>
         </View>
         <View style={styles.headerRight}>
           {/* <TouchableOpacity>
             <Image
               source={icons.moreCircle as ImageSourcePropType}
               resizeMode="contain"
               style={[
                 styles.moreCircleIcon,
                 {
                   tintColor: COLORS.greyscale900,
                 },
               ]}
             />
           </TouchableOpacity> */}
         </View>
       </View>
     );
   };

  /**
   * Render order status steps
   */

  const renderOrderStatusSteps = () => {
    // Find the index of the current status
    const currentIndex = ORDER_STATUS_STEPS.findIndex(
      (s) => s.key === currentStatus
    );

    // If delivered, filter out cancelled and refunded steps
    let stepsToShow = ORDER_STATUS_STEPS;
    if (
      currentStatus != OrderStatus.CANCELLED &&
      currentStatus != OrderStatus.REFUNDED
    ) {
      stepsToShow = ORDER_STATUS_STEPS.filter(
        (step) =>
          step.key !== OrderStatus.CANCELLED &&
          step.key !== OrderStatus.REFUNDED
      );
    }

    return (
      <View style={{ marginVertical: 24 }}>
        {history?.reverse()?.map((step: any, idx: any) => {
          return (
            <View key={step.key} style={styles.orderDetailsContainer}>
              <View style={styles.orderViewContainer}>
                <Fontisto
                  name={"radio-btn-active"}
                  size={24}
                  color={COLORS.primary}
                />
                <View style={styles.orderView}>
                  <View style={[styles.orderDetailsTitle]}>
                    <Text
                      style={[
                        {
                          fontSize: 18,
                          fontFamily: "bold",
                          marginHorizontal: 5,
                          color: COLORS.primary,
                        },
                      ]}
                    >
                      {isRTL
                        ? ORDER_STATUS_STEPS?.find(
                            (item) => item.key == step?.newStatus
                          )?.label?.ar
                        : ORDER_STATUS_STEPS?.find(
                            (item) => item.key == step?.newStatus
                          )?.label?.en}
                    </Text>

                    <Text style={{ color: COLORS?.gray, fontSize: 12 }}>
                      {moment(step?.createdAt).format("YYYY-MM-DD")}
                    </Text>
                  </View>
                  <Text style={styles.orderDetailsSubtitle}>
                    {isRTL
                      ? ORDER_STATUS_STEPS?.find(
                          (item) => item.key == step?.newStatus
                        )?.estimation?.ar
                      : ORDER_STATUS_STEPS?.find(
                          (item) => item.key == step?.newStatus
                        )?.estimation?.en}{" "}
                  </Text>
                </View>
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
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.bottomContainer]}>
            <View style={styles.separateLine} />
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
                  {data?.orderNumber}
                </Text>
                <Text
                  style={[styles.viewSubtitle, { color: COLORS.grayscale700 }]}
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
                  style={[styles.viewSubtitle, { color: COLORS.grayscale700 }]}
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
                  {t(data?.paymentMethod)}
                </Text>
                <Text
                  style={[styles.viewSubtitle, { color: COLORS.grayscale700 }]}
                >
                  {t("Payment Method")}
                </Text>
              </View>
            </View>
            <View style={styles.separateLine} />
            {renderOrderStatusSteps()}
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
  bottomContainer: {},
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
    width: SIZES.width - 32,
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
    width: SIZES.width - 32,
  },
  viewItemContainer: {
    alignItems: "center",
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
    tintColor: COLORS.primary,
  }
});

export default MyOrderTrack;

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { COLORS, SIZES, icons } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { NavigationProp } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import Button from "@/components/Button";
import { useAuthStatus } from "@/data";
import { useCart, useConfirmOrder, useValidateCoupon } from "@/data/useCart";
import { useOneOrder } from "@/data/useOrders";
import OrderTable from "@/components/OrderTable";
import { OrderStatus } from "./myordertrack";

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
// Transaction ereceipt
const OrderDetail = () => {
  const deliveryFees = 20;
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);

  const [couponError, setCouponError] = useState(null);

  const [modalVisibleForOrder, setModalVisibleForOrder] = useState(false);

  const [errorAtConfirmOrder, setErrorAtConfirmOrder] = useState(false);

  const [showLoginCard, setShowLoginCard] = useState(false);

  const { t, isRTL } = useLanguageContext();

  const params = useLocalSearchParams();

  const orderId = params.orderId as string;
  const { data } = useOneOrder(orderId);

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
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" },
      ]}
    >
      <Header title={t("Order Details")} />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginVertical: 22 }}>
            {/* <Barcode ... /> */}
            <View
              style={[
                styles.summaryContainer,
                {
                  backgroundColor: COLORS.white,
                  borderRadius: 6,
                },
              ]}
            >
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Name")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {data?.user?.firstName}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Address")}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={[
                      styles.viewRight,
                      {
                        color: COLORS.black,
                        marginInline: 5,
                      },
                    ]}
                  >
                    {`${data?.shippingAddress?.city} - ${data?.shippingAddress?.state}`}
                  </Text>
                </View>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Phone")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {data?.shippingAddress?.phone || data?.user?.phone}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryContainer,
                {
                  backgroundColor: COLORS.white,
                  borderRadius: 6,
                },
              ]}
            >
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Amount")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {data?.subtotal} {t("EGP")}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Delivery Fee")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {data?.shippingCost} {t("EGP")}
                </Text>
              </View>
              {data?.discountAmount && (
                <View style={styles.viewContainer}>
                  <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                    {t("Discount")}
                  </Text>
                  <Text style={[styles.viewRight, { color: COLORS.black }]}>
                    {data?.discountAmount} {t("EGP")}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={[
                styles.summaryContainer,
                {
                  backgroundColor: COLORS.white,
                  borderRadius: 6,
                },
              ]}
            >
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Total")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {data?.total} {t("EGP")}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Payment Methods")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {t("Cash on Delivery")}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Date")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {moment(data?.createdAt).format("YYYY-MM-DD")}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Status")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.statusBtn,
                    {
                      backgroundColor: statusColor(data?.status),
                    },
                  ]}
                >
                  <Text style={styles.statusBtnText}>
                    {isRTL
                      ? ORDER_STATUS_STEPS?.find(
                          (sub) => sub.key == data?.status
                        )?.label?.ar
                      : ORDER_STATUS_STEPS?.find(
                          (sub) => sub.key == data?.status
                        )?.label?.en}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <OrderTable data={data?.items} />
        </KeyboardAwareScrollView>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              // opacity: 0.5,
              backgroundColor: "#80808040",
              left: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                padding: 16,
                backgroundColor: COLORS.white,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={icons.ornament as any}
                    resizeMode="contain"
                    style={[
                      styles.icon,
                      {
                        tintColor: couponError ? COLORS?.error : COLORS.primary,
                      },
                    ]}
                  />
                  <Image
                    source={
                      couponError ? icons?.infoCircle : (icons.check2 as any)
                    }
                    style={[styles.check, { tintColor: COLORS.white }]}
                  />
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      color: couponError ? COLORS?.blackTie : COLORS.primary,
                      fontWeight: "bold",
                    }}
                  >
                    {couponError ? t(couponError) : " تم تطبيق القسيمة بنجاح!"}
                  </Text>
                  {!couponError && (
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "center",
                        marginTop: 15,
                      }}
                    >
                      تم تطبيق القسيمة بنجاح على طلبك. استمتع بتخفيضك!
                    </Text>
                  )}
                </View>
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                  <Button
                    title={t("Close")}
                    filled
                    style={[styles.applyBtn]}
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleForOrder}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisibleForOrder(false)}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              // opacity: 0.5,
              backgroundColor: "#80808040",
              left: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                padding: 16,
                backgroundColor: COLORS.white,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={icons.ornament as any}
                    resizeMode="contain"
                    style={[
                      styles.icon,
                      {
                        tintColor: errorAtConfirmOrder
                          ? COLORS?.error
                          : COLORS.primary,
                      },
                    ]}
                  />
                  <Image
                    source={
                      errorAtConfirmOrder
                        ? icons?.infoCircle
                        : (icons.check2 as any)
                    }
                    style={[styles.check, { tintColor: COLORS.white }]}
                  />
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      color: errorAtConfirmOrder
                        ? COLORS?.blackTie
                        : COLORS.primary,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {errorAtConfirmOrder
                      ? t("Error please try again!")
                      : "تم تاكيد الطلب بنجاح"}
                  </Text>
                  {!errorAtConfirmOrder && (
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "center",
                        marginTop: 15,
                      }}
                    >
                      تم تأكيد الطلب بنجاح، سنقوم بإعلامك عند جاهزيته للشحن أو
                      الاستلام. شكرًا لتسوقك معنا!{" "}
                    </Text>
                  )}
                </View>
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                  <Button
                    title={t("Close")}
                    filled
                    style={[styles.applyBtn]}
                    onPress={() => setModalVisibleForOrder(false)}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={showLoginCard}>
        <TouchableWithoutFeedback onPress={() => setShowLoginCard(false)}>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              // opacity: 0.5,
              backgroundColor: "#80808040",
              left: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                padding: 30,
                backgroundColor: COLORS.white,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={icons.ornament as any}
                    resizeMode="contain"
                    style={[styles.icon, { tintColor: COLORS.primary }]}
                  />
                  <Image
                    source={icons?.userDefault as any}
                    style={[styles.check, { tintColor: COLORS.white }]}
                  />
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      color: COLORS.primary,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {t("Please login to make this Action")}
                  </Text>
                </View>
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                  <Button
                    title={t("Login")}
                    filled
                    style={[[styles.applyBtn, { width: 200 }]]}
                    onPress={() => navigation.navigate("login")}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 200,
    width: 150,
    // marginBottom: 15,
  },
  check: {
    width: 50,
    height: 50,
    position: "absolute",
    top: "46%",
    left: "42%",
  },
  continueBtn: {
    borderRadius: 30,
    marginTop: 22,

    width: SIZES.width - 32,
  },
  applyBtn: {
    borderRadius: 10,
    // marginTop: 22,
    width: 100,
    height: 48,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceSubtitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
  },
  editIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary,
  },
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

  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  summaryContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 10,
    marginVertical: 4,
    borderColor: COLORS.tertiaryWhite,
    borderBottomWidth: 1,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 12,
  },
  viewLeft: {
    fontSize: 12,
    fontFamily: "regular",
    color: "gray",
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
  },
  copyContentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBtn: {
    width: 86,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
  },
  statusBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "medium",
    color: "#fff",
  },
  headerLogo: {
    height: 36,
    width: 36,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12,
  },
});

export default OrderDetail;

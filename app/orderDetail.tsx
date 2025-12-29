import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ImageSourcePropType,
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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

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
        { backgroundColor: COLORS.grayscale100, direction: isRTL ? "rtl" : "ltr" },
      ]}
    >
      <Header title={t("Order Details")} />
      <View style={[styles.container, { backgroundColor: COLORS.grayscale100 }]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginVertical: 16 }}>
            {/* Customer Information Card */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <AntDesign name="user" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>معلومات العميل</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Name")}</Text>
                <Text style={styles.infoValue}>
                  {data?.user?.firstName}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Address")}</Text>
                <Text style={styles.infoValue}>
                  {`${data?.shippingAddress?.city} - ${data?.shippingAddress?.state}`}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Phone")}</Text>
                <Text style={styles.infoValue}>
                  {data?.shippingAddress?.phone || data?.user?.phone}
                </Text>
              </View>
            </View>

            {/* Order Summary Card */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <AntDesign name="filetext1" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>ملخص الطلب</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t("Amount")}</Text>
                <Text style={styles.summaryValue}>
                  {data?.subtotal} {t("EGP")}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t("Delivery Fee")}</Text>
                <Text style={styles.summaryValue}>
                  {data?.shippingCost} {t("EGP")}
                </Text>
              </View>
              
              {data?.discountAmount && (
                <View style={styles.summaryRow}>
                  <Text style={styles.discountLabel}>
                    <MaterialIcons name="discount" size={16} color="#00CC00" />
                    {" "}{t("Discount")}
                  </Text>
                  <Text style={styles.discountValue}>
                    - {data?.discountAmount} {t("EGP")}
                  </Text>
                </View>
              )}
            </View>
            {/* Payment & Status Card */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <AntDesign name="wallet" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>تفاصيل الدفع والحالة</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Total")}</Text>
                <Text style={styles.totalValue}>
                  {data?.total} {t("EGP")}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Payment Methods")}</Text>
                <Text style={styles.infoValue}>
                  {t("Cash on Delivery")}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Date")}</Text>
                <Text style={styles.infoValue}>
                  {moment(data?.createdAt).format("YYYY-MM-DD")}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Status")}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: statusColor(data?.status),
                    },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {isRTL
                      ? ORDER_STATUS_STEPS?.find(
                          (sub) => sub.key == data?.status
                        )?.label?.ar
                      : ORDER_STATUS_STEPS?.find(
                          (sub) => sub.key == data?.status
                        )?.label?.en}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Order Items Section */}
            <View style={styles.orderItemsCard}>
              <View style={styles.orderItemsHeaderSection}>
                <View style={styles.orderItemsIconContainer}>
                  <AntDesign name="shoppingcart" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.orderItemsTitle}>المنتجات المطلوبة</Text>
              </View>
              <OrderTable data={data?.items} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: couponError ? "#FFE5E5" : COLORS.tansparentPrimary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <AntDesign
                  name={couponError ? "closecircle" : "checkcircle"}
                  size={40}
                  color={couponError ? "#FF4D4D" : COLORS.primary}
                />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.black,
                  fontFamily: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {couponError ? t(couponError) : "تم تطبيق القسيمة بنجاح!"}
              </Text>
              
              {!couponError && (
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    color: COLORS.gray,
                    marginBottom: 24,
                    lineHeight: 22,
                  }}
                >
                  تم تطبيق القسيمة بنجاح على طلبك. استمتع بتخفيضك!
                </Text>
              )}
              
              <Button
                title={t("Close")}
                filled
                style={styles.applyBtn}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleForOrder}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisibleForOrder(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: errorAtConfirmOrder ? "#FFE5E5" : COLORS.tansparentPrimary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <AntDesign
                  name={errorAtConfirmOrder ? "closecircle" : "checkcircle"}
                  size={40}
                  color={errorAtConfirmOrder ? "#FF4D4D" : COLORS.primary}
                />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.black,
                  fontFamily: "bold",
                  marginBottom: 10,
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
                    fontSize: 14,
                    textAlign: "center",
                    color: COLORS.gray,
                    marginBottom: 24,
                    lineHeight: 22,
                  }}
                >
                  تم تأكيد الطلب بنجاح، سنقوم بإعلامك عند جاهزيته للشحن أو
                  الاستلام. شكرًا لتسوقك معنا!
                </Text>
              )}
              
              <Button
                title={t("Close")}
                filled
                style={styles.applyBtn}
                onPress={() => setModalVisibleForOrder(false)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={showLoginCard}>
        <TouchableWithoutFeedback onPress={() => setShowLoginCard(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: COLORS.tansparentPrimary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <AntDesign
                  name="login"
                  size={40}
                  color={COLORS.primary}
                />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.black,
                  fontFamily: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {t("Please login to make this Action")}
              </Text>
              
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  color: COLORS.gray,
                  marginBottom: 24,
                  lineHeight: 22,
                }}
              >
                يجب تسجيل الدخول للمتابعة
              </Text>
              
              <Button
                title={t("Login")}
                filled
                style={[styles.applyBtn, { width: 200 }]}
                onPress={() => navigation.navigate("login")}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.grayscale100,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.grayscale100,
    padding: 16,
  },
  
  // Section Card Styles
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "bold",
    color: COLORS.black,
  },
  
  // Info Row Styles
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "semibold",
    color: COLORS.black,
    textAlign: "right",
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 8,
  },
  
  // Summary Row Styles
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: "semibold",
    color: COLORS.black,
  },
  discountLabel: {
    fontSize: 15,
    fontFamily: "semibold",
    color: "#00CC00",
    flexDirection: "row",
    alignItems: "center",
  },
  discountValue: {
    fontSize: 15,
    fontFamily: "bold",
    color: "#00CC00",
  },
  
  // Status Badge Styles
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  statusBadgeText: {
    fontSize: 13,
    fontFamily: "bold",
    color: COLORS.white,
  },
  
  // Order Items Section
  orderItemsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderItemsHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  orderItemsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  orderItemsTitle: {
    fontSize: 17,
    fontFamily: "bold",
    color: COLORS.black,
  },
  orderItemsSection: {
    marginBottom: 12,
  },
  orderItemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    height: 200,
    width: 150,
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
    width: 100,
    height: 48,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Legacy styles kept for compatibility
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

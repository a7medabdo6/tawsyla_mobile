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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { COLORS, icons, images } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { NavigationProp } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import RBSheet from "react-native-raw-bottom-sheet";
import Button from "@/components/Button";
import { useAddress } from "@/data/useAddress";
import Input from "@/components/Input";
import { useAuthStatus } from "@/data";
import { useCart, useConfirmOrder, useValidateCoupon } from "@/data/useCart";
import { useSettings } from "@/data/useSettings";

// Transaction ereceipt
const Checkout = () => {
  const { data: settingsData } = useSettings();
  const deliveryFees = settingsData?.shippingCost ||25;
  // console.log(settingsData?.shippingCost, "settingsDataaaaa");
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);

  const [couponError, setCouponError] = useState(null);

  const [modalVisibleForOrder, setModalVisibleForOrder] = useState(false);

  const [errorAtConfirmOrder, setErrorAtConfirmOrder] = useState(false);

  const [showLoginCard, setShowLoginCard] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const { t, isRTL } = useLanguageContext();
  const addressBottomSheet = useRef<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const { data, isLoading } = useAddress();
  const [couponCode, setCouponCode] = useState<string>("");
  const { data: cartData, error } = useCart();

  const [couponDetails, setCouponDetails] = useState<any>("");
  const params = useLocalSearchParams();

  const totalPrice = params.totalPrice as string;
  const { data: authStatus, refetch } = useAuthStatus();
  const { mutate: validateCoupon, isPending } = useValidateCoupon();

  const { mutate: confirmOrder, isPending: isPendingForConfirm } =
    useConfirmOrder();

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedAddress(data[0]); // Set the first address as default
    }
  }, [data]);

  const handleValidateCoupon = () => {
    validateCoupon(
      { code: couponCode, orderAmount: +totalPrice + deliveryFees },
      {
        onSuccess: async (data) => {
          // console.log(data, "couponssss");
          if (data?.isValid) {
            setCouponError(null);

            setCouponDetails(data);
            setModalVisible(true);
          } else {
            setModalVisible(true);
            setCouponError(data?.message);
            setCouponDetails(null);
          }
          try {
          } catch (err) {
            console.error("Error handling password update success:", err);
          }
        },
      }
    );
  };

  const handleConfirmOrder = () => {
    confirmOrder(
      {
        shippingAddressId: selectedAddress?.id,
        paymentMethod: "cash",
        items: cartData?.items?.map((item: any) => {
          return {
            productId: item?.productId,
            variantId: item?.variantId,
            quantity: item?.quantity,
            notes: "Please deliver in the morning",
          };
        }),
        couponCode: couponDetails?.coupon?.code,
        // loyaltyRewardId: "123e4567-e89b-12d3-a456-426614174000",
        notes: "Please deliver between 9 AM and 5 PM",
        shippingCost: deliveryFees,
        taxAmount: 0,
      },
      {
        onSuccess: async (data) => {
          // console.log(data, "confirm order");
          setShowLoginCard(false);

          setModalVisibleForOrder(true);
          setErrorAtConfirmOrder(false);
        },
        onError: async (data: any) => {
          // console.log(data, "confirm order");
          if (data?.statusCode == "401") {
            setShowLoginCard(true);
          } else {
            setErrorAtConfirmOrder(true);
            setModalVisibleForOrder(true);
          }
        },
      }
    );
  };
  const handleDropdownSelect = (item: any) => {
    setSelectedItem(item.value);
    setModalVisible(false);

    // Perform actions based on the selected item
    switch (item.value) {
      case "share":
        setModalVisible(false);
        navigation.navigate("(tabs)");
        break;
      case "downloadEReceipt":
        setModalVisible(false);
        navigation.navigate("(tabs)");
        break;
      case "print":
        setModalVisible(false);
        navigation.navigate("(tabs)");
        break;
      default:
        break;
    }
  };

  const transactionId = "SKD354822747";

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(transactionId);
    Alert.alert(t("Copied!"), t("Transaction ID copied to clipboard."));
  };
  const handleInputChange = useCallback((id: string, text: string) => {
    setCouponCode(text);
  }, []);
  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: COLORS.grayscale100, direction: isRTL ? "rtl" : "ltr" },
      ]}
    >
      <Header 
        title="إتمام الطلب" 
        onBack={() => navigation.navigate("(tabs)", { screen: "cart" })}
      />
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
                  {authStatus?.user?.firstName}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Address")}</Text>
                <View style={styles.addressContainer}>
                  <TouchableOpacity
                    onPress={() => addressBottomSheet.current.open()}
                    style={styles.editButton}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.infoValue, ]}>
                    {selectedAddress
                      ? `${selectedAddress?.city} - ${selectedAddress?.state}`
                      : t("Select Address")}
                  </Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t("Phone")}</Text>
                <Text style={styles.infoValue}>
                  {authStatus?.user?.phone}
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
                  {totalPrice} {t("EGP")}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t("Delivery Fee")}</Text>
                <Text style={styles.summaryValue}>
                  {deliveryFees} {t("EGP")}
                </Text>
              </View>
            </View>
            {/* Coupon Card */}
            <View style={styles.couponCard}>
              <View style={styles.couponHeader}>
                <Image
                  source={icons.discount as ImageSourcePropType}
                  style={styles.couponIcon}
                />
                <Text style={styles.couponTitle}>كوبون الخصم</Text>
              </View>
              
              <View style={styles.couponInputContainer}>
                <View style={{ flex: 1 }}>
                  <Input
                    id="coupon"
                    onInputChanged={handleInputChange}
                    value={couponCode}
                    placeholder={t("Enter Promo Code")}
                    placeholderTextColor={COLORS.gray}
                    containerStyle={styles.couponInput}
                    icon={icons.discount}
                  />
                </View>
                <Button
                  title={t("Apply")}
                  filled
                  style={styles.applyButton}
                  onPress={handleValidateCoupon}
                  isLoading={isPending}
                />
              </View>

              {couponError && (
                <View style={styles.errorContainer}>
                  <AntDesign name="closecircle" size={16} color="#FF4D4D" />
                  <Text style={styles.errorText}>{couponError}</Text>
                </View>
              )}
              
              {couponDetails && (
                <View style={styles.successContainer}>
                  <AntDesign name="checkcircle" size={16} color="#00CC00" />
                  <Text style={styles.successText}>
                    {t("Coupon applied successfully")}
                  </Text>
                </View>
              )}
            </View>

            {/* Total Amount Card */}
            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t("Total")}</Text>
                <Text style={styles.totalAmount}>
                  {couponDetails
                    ? couponDetails?.totalAmount
                    : +totalPrice + deliveryFees}{" "}
                  {t("EGP")}
                </Text>
              </View>
              {couponDetails && (
                <View style={styles.savingsRow}>
                  <Text style={styles.savingsText}>
                    🎉 لقد وفرت {couponDetails?.discountAmount} {t("EGP")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.bottomShadow}>
            <Button
              title={t("Confirm")}
              filled
              style={styles.continueBtn}
              onPress={() =>
                selectedAddress
                  ? handleConfirmOrder()
                  : addressBottomSheet.current.open()
              }
              isLoading={isPendingForConfirm}
            />
          </View>
        </View>
        <RBSheet
          ref={addressBottomSheet}
          height={500}
          openDuration={250}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: COLORS.gray2,
              width: 50,
              height: 5,
              marginTop: 10,
            },
            container: {
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "bold",
                  color: COLORS.black,
                }}
              >
                {t("Select Address")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  addressBottomSheet.current.close();
                  navigation.navigate("address",{returnTo: "checkout",totalPrice:params?.totalPrice});
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.tansparentPrimary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <EvilIcons name="plus" size={20} color={COLORS.primary} />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "medium",
                    color: COLORS.primary,
                    marginLeft: 4,
                  }}
                >
                  {t("Add New")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Address List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {data?.map((item: any) => {
                const isSelected = selectedAddress?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelectedAddress(item)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      borderWidth: isSelected ? 1.5 : 1,
                      borderColor: isSelected ? COLORS.primary : COLORS.gray2,
                      borderRadius: 16,
                      marginBottom: 12,
                      backgroundColor: isSelected ? COLORS.white : COLORS.white,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    {/* Icon Container */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: isSelected
                          ? COLORS.tansparentPrimary
                          : COLORS.grayscale100,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={icons.home2Outline as ImageSourcePropType}
                        style={{
                          width: 22,
                          height: 22,
                          tintColor: isSelected ? COLORS.primary : COLORS.gray,
                        }}
                      />
                    </View>

                    {/* Text Content */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: "bold",
                            color: COLORS.black,
                            textAlign: "left",
                          }}
                        >
                          {item.city} - {item.state}
                        </Text>
                        {isSelected && (
                          <View
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 9,
                              backgroundColor: COLORS.primary,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <AntDesign
                              name="check"
                              size={12}
                              color={COLORS.white}
                            />
                          </View>
                        )}
                      </View>

                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "regular",
                          color: COLORS.gray,
                          textAlign: "left",
                          marginBottom: 6,
                          lineHeight: 18,
                        }}
                        numberOfLines={2}
                      >
                        {item.additionalInfo}
                      </Text>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <AntDesign name="phone" size={12} color={COLORS.gray} />
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "medium",
                            color: COLORS.gray,
                            textAlign: "left",
                            marginLeft: 6,
                          }}
                        >
                          {item.phone}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Save Button */}
            <View
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                right: 20,
              }}
            >
              <Button
                title={t("Confirm Selection")}
                filled
                style={{
                  borderRadius: 30,
                  height: 50,
                }}
                onPress={() => addressBottomSheet.current.close()}
              />
            </View>
          </View>
        </RBSheet>
      </View>
      {/* Modal for Order Success */}
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
              <View>
                <View style={styles.modalTop}>
                  <View
                    style={[
                      styles.modalIconContainer,
                      {
                        backgroundColor: errorAtConfirmOrder
                          ? "#ffe5e5"
                          : COLORS.tansparentPrimary,
                      },
                    ]}
                  >
                    <Image
                      source={
                        errorAtConfirmOrder
                          ? (icons.close2 as ImageSourcePropType)
                          : (images.orderSuccess as ImageSourcePropType)
                      }
                      resizeMode="contain"
                      style={[
                        styles.modalIcon,
                       
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        color: COLORS.greyscale900,
                      },
                    ]}
                  >
                    {errorAtConfirmOrder
                      ? t("Order Failed")
                      : t("Order Successful")}
                  </Text>
                  {errorAtConfirmOrder ? (
                    <Text
                      style={[
                        styles.modalSubtitle,
                        {
                          color: COLORS.greyscale900,
                        },
                      ]}
                    >
                      {t("Something went wrong, please try again later")}
                    </Text>
                  ) : (
                    <>
                    <Text
                      style={[
                        styles.modalSubtitle,
                        {
                          color: COLORS.greyscale900,
                          textAlign: "center",
                          marginTop: 15,
                        },
                      ]}
                    >
                      تم تأكيد الطلب بنجاح، سنقوم بإعلامك عندما يكون جاهزاً للشحن أو الاستلام. شكراً لطلبك من  
                    

                    </Text>
                                                                    <Text style={{ fontFamily: "bold", color: COLORS.primary}}>وصلها!</Text>

                    </>
                   
                  )}
                </View>
                <View style={styles.modalBottom}>
                  <Button
                    title={errorAtConfirmOrder ? t("Try Again") : t("Continue")}
                    filled
                    style={[styles.applyBtn]}
                    onPress={() => {
                      setModalVisibleForOrder(false);
                      navigation.navigate("(tabs)", {
                        screen: "createorder",
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal for Login */}
      <Modal animationType="slide" transparent={true} visible={showLoginCard}>
        <TouchableWithoutFeedback onPress={() => setShowLoginCard(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View >
                <View style={styles.modalTop}>
                  <View
                    style={[
                      styles.modalIconContainer,
                      {
                        backgroundColor: "#ffe5e5",
                      },
                    ]}
                  >
                    <Image
                      source={icons.close2 as ImageSourcePropType}
                      resizeMode="contain"
                      style={[
                        styles.modalIcon,
                        {
                          tintColor: "red",
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        color: COLORS.greyscale900,
                      },
                    ]}
                  >
                    {t("Login Required")}
                  </Text>
                  <Text
                    style={[
                      styles.modalSubtitle,
                      {
                        color: COLORS.greyscale900,
                      },
                    ]}
                  >
                    {t("Please login to continue")}
                  </Text>
                </View>
                <View style={styles.modalBottom}>
                  <Button
                    title={t("Login")}
                    filled
                    style={[styles.applyBtn]}
                    onPress={() => {
                      setShowLoginCard(false);
                      navigation.navigate("login");
                    }}
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
  area: {
    flex: 1,
    backgroundColor: COLORS.grayscale100,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.grayscale100,
    padding: 16,
    paddingBottom: 90,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  
  // Summary Styles
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
  
  // Coupon Card Styles
  couponCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.tansparentPrimary,
  },
  couponHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  couponIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
    marginLeft: 10,
  },
  couponTitle: {
    fontSize: 17,
    fontFamily: "bold",
    color: COLORS.black,
  },
  couponInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  couponInput: {
    backgroundColor: COLORS.grayscale100,
    borderRadius: 12,
    height: 52,
    width: "100%",
    borderWidth: 0,
  },
  applyButton: {
    width: 100,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 10,
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 13,
    fontFamily: "medium",
    marginLeft: 10,
    flex: 1,
    textAlign: "left",
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#E5FFE5",
    padding: 12,
    borderRadius: 10,
  },
  successText: {
    color: "#00CC00",
    fontSize: 13,
    fontFamily: "medium",
    marginLeft: 10,
    flex: 1,
    textAlign: "left",
  },
  
  // Total Card Styles
  totalCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.white,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.white,
  },
  savingsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
  },
  savingsText: {
    fontSize: 14,
    fontFamily: "semibold",
    color: COLORS.white,
    textAlign: "center",
  },
  
  // Bottom Container Styles
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayscale200,
  },
  bottomShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  continueBtn: {
    width: "100%",
    height: 56,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
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
  modalTop: {
    alignItems: "center",
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalIcon: {
    width: 40,
    height: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
  },
  modalBottom: {
    marginTop: 24,
    width: 120,
    marginHorizontal: "auto",
  },
  applyBtn: {
    width: "100%",
    height: 52,
    borderRadius: 10,
  },
  
  // Legacy styles kept for compatibility
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 26,
    height: 26,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  summaryContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 6,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "gray",
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
  },
  serviceSubtitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default Checkout;

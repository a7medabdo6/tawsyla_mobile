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

// Transaction ereceipt
const Checkout = () => {
  const deliveryFees = 20;
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
          console.log(data, "couponssss");
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
          console.log(data, "confirm order");
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
        { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" },
      ]}
    >
      <Header title="إتمام الطلب" />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginVertical: 22 }}>
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
                  {authStatus?.user?.firstName}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Address")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => addressBottomSheet.current.open()}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color={COLORS.primary}
                      style={{ marginEnd: 6 }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.viewRight, { color: COLORS.black }]}>
                    {selectedAddress
                      ? `${selectedAddress?.city} - ${selectedAddress?.state}`
                      : t("Select Address")}
                  </Text>
                </View>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Phone")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {authStatus?.user?.phone}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryContainer,
                {
                  backgroundColor: COLORS.tansparentPrimary,
                  borderRadius: 6,
                  marginTop: 20,
                },
              ]}
            >
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Amount")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {totalPrice} {t("EGP")}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Shipping")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {deliveryFees} {t("EGP")}
                </Text>
              </View>
              {/* <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Tax")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  $ 0
                </Text>
              </View> */}
            </View>
            <View
              style={[
                styles.summaryContainer,
                {
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  marginTop: 16,
                  padding: 16,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "bold",
                  color: COLORS.black,
                  marginBottom: 12,
                  textAlign: "left",
                }}
              >
                كوبون
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Input
                    id="coupon"
                    onInputChanged={handleInputChange}
                    value={couponCode}
                    placeholder={t("Enter Promo Code")}
                    placeholderTextColor={COLORS.gray}
                    containerStyle={{
                      backgroundColor: COLORS.grayscale100,
                      borderRadius: 12,
                      height: 50,
                      width: "100%",
                      borderWidth: 0,
                    }}
                    icon={icons.discount}
                  />
                </View>
                <Button
                  title={t("Apply")}
                  filled
                  style={{
                    width: 100,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: COLORS.primary,
                  }}
                  onPress={handleValidateCoupon}
                  isLoading={isPending}
                />
              </View>

              {couponError && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    backgroundColor: "#FFE5E5",
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <AntDesign name="closecircle" size={14} color="#FF4D4D" />
                  <Text
                    style={{
                      color: "#FF4D4D",
                      fontSize: 12,
                      fontFamily: "medium",
                      marginLeft: 8,
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    {couponError}
                  </Text>
                </View>
              )}
              {couponDetails && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    backgroundColor: "#E5FFE5",
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <AntDesign name="checkcircle" size={14} color="#00CC00" />
                  <Text
                    style={{
                      color: "#00CC00",
                      fontSize: 12,
                      fontFamily: "medium",
                      marginLeft: 8,
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    {t("Coupon applied successfully")}
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
                  marginTop: 20,
                },
              ]}
            >
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Total")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {couponDetails
                    ? couponDetails?.totalAmount
                    : +totalPrice + deliveryFees}{" "}
                  {t("EGP")}
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.bottomContainer}>
          <Button
            title={t("Confirm")}
            filled
            style={styles.continueBtn}
            onPress={() =>
              selectedAddress
                ? handleConfirmOrder()
                : addressBottomSheet.current.open()
            }
          />
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
                  navigation.navigate("address");
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
                        {
                          tintColor: errorAtConfirmOrder
                            ? "red"
                            : COLORS.primary,
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
                      {t(
                        "Order confirmed successfully, we will notify you when it is ready for shipping or pickup. Thank you for shopping with us!"
                      )}
                    </Text>
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
              <View>
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
    marginBottom: 16,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  applyBtn: {
    width: "25%",
    height: 50,
    borderRadius: 6,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtn: {
    width: "100%",
    height: 50,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTop: {
    alignItems: "center",
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalIcon: {
    width: 30,
    height: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
  },
  modalBottom: {
    marginTop: 20,
    width: "100%",
  },
  serviceSubtitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default Checkout;

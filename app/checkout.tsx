import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { COLORS, SIZES, icons, images } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { NavigationProp } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLanguageContext } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import RBSheet from "react-native-raw-bottom-sheet";
import Button from "@/components/Button";
import ServiceItem from "@/components/ServiceItem";
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
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
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
              {t("Complete Order")}
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
                  {t("Daniel Austion")}
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
                    {`${selectedAddress?.city} - ${selectedAddress?.state}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => addressBottomSheet.current.open()}
                  >
                    <Image
                      source={icons.editPencil as ImageSourcePropType}
                      resizeMode="contain"
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View style={styles.viewContainer}>
            <Text style={[styles.viewLeft, { color: "gray" }]}>
              {t("Package Type")}
            </Text>
            <Text style={[styles.viewRight, { color: COLORS.black }]}>
              {t("Detroit-style pizza")}
            </Text>
          </View> */}
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: "gray" }]}>
                  {t("Phone")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {authStatus?.user?.phone || selectedAddress?.phone}
                </Text>
              </View>
              {/* <View style={styles.viewContainer}>
            <Text style={[styles.viewLeft, { color: "gray" }]}>
              {t("Category")}
            </Text>
            <Text style={[styles.viewRight, { color: COLORS.black }]}>
              {t("Shipping")}
            </Text>
          </View> */}
              {/* <View style={styles.viewContainer}>
            <Text style={[styles.viewLeft, { color: "gray" }]}>
              {t("ID")}
            </Text>
            <Text style={[styles.viewRight, { color: COLORS.black }]}>
              {t("PIZZA XT134")}
            </Text>
          </View> */}
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
                  {totalPrice} {t("EGP")}
                </Text>
              </View>
              <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Delivery Fee")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {deliveryFees} {t("EGP")}
                </Text>
              </View>
              {couponDetails?.discountAmount && (
                <View style={styles.viewContainer}>
                  <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                    {t("Discount")}
                  </Text>
                  <Text style={[styles.viewRight, { color: COLORS.black }]}>
                    {couponDetails?.discountAmount} {t("EGP")}
                  </Text>
                </View>
              )}

              <View style={styles.viewContainer}>
                <TouchableOpacity
                  style={[
                    styles.applyBtn,
                    {
                      backgroundColor: couponCode
                        ? COLORS.primary
                        : COLORS.paleGreenDark,
                    },
                  ]}
                  onPress={() => {
                    handleValidateCoupon();
                  }}
                  disabled={!couponCode}
                >
                  <Text
                    style={[
                      {
                        color: !couponCode ? COLORS.primary : COLORS.white,
                      },
                    ]}
                  >
                    {t("Apply")}
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1, marginRight: 30 }}>
                  <Input
                    id="coupon"
                    value={couponCode}
                    onInputChanged={handleInputChange}
                    placeholder={t("coupon code")}
                    placeholderTextColor={COLORS.black}
                    icon={icons.discountOutline}
                  />
                </View>
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
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Total")}
                </Text>
                <Text style={[styles.viewRight, { color: COLORS.black }]}>
                  {couponDetails?.finalAmount || +totalPrice + deliveryFees}{" "}
                  {t("EGP")}
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
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
              {/* <View style={styles.viewContainer}>
            <Text style={[styles.viewLeft, { color: COLORS.black }]}>
              {t("Transaction ID")}
            </Text>
            <View style={styles.copyContentContainer}>
              <Text style={styles.viewRight}>{t(transactionId)}</Text>
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={handleCopyToClipboard}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View> */}
              {/* <View style={styles.viewContainer}>
                <Text style={[styles.viewLeft, { color: COLORS.black }]}>
                  {t("Status")}
                </Text>
                <TouchableOpacity style={styles.statusBtn}>
                  <Text style={styles.statusBtnText}>{t("Pending")}</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={{ alignItems: "center" }}>
          <Button
            title={t("Confirm")}
            filled
            style={styles.continueBtn}
            onPress={() =>selectedAddress ? handleConfirmOrder() : addressBottomSheet.current.open()}
          />
        </View>
        <RBSheet
          ref={addressBottomSheet}
          height={380}
          openDuration={250}
          closeOnPressMask={false}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,.2)",
            },
            draggableIcon: {
              backgroundColor: COLORS.gray,
              width: 100,
              height: 4,
            },
            container: {
              backgroundColor: COLORS.white,
            },
          }}
        >
          <View
            style={{
              width: SIZES.width - 32,
              marginHorizontal: 16,
              flexDirection: "column",
              marginVertical: 22,
              backgroundColor: COLORS.white,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text
              style={[
                styles.serviceSubtitle,
                {
                  color: COLORS.gray,
                },
              ]}
            >
              {t("Select Address")}
            </Text>
            <TouchableOpacity
            onPress={() => navigation.navigate("address")}
            >
            <EvilIcons name="plus" size={24} color={COLORS.primary}/>
            </TouchableOpacity> 
            </View>
            <View style={{ marginVertical: 22 }}>
              <ScrollView style={{ marginBottom: 80 }}>
                {data?.map((item: any) => {
                  return (
                    <ServiceItem
                      key={item.id}
                      pkgIcon={icons.home2Outline as ImageSourcePropType}
                      title={`${item.city} - ${item.state}`}
                      duration={item.additionalInfo}
                      price=""
                      isSelected={selectedAddress?.id === item.id}
                      phone={item.phone}
                      onSelect={() => setSelectedAddress(item)}
                      onPress={() => {}}
                    />
                  );
                })}
              </ScrollView>
              <Button
                title="Save"
                filled
                style={[
                  styles.continueBtn,
                  { marginBottom: 20, position: "absolute", bottom: 0 },
                ]}
                onPress={() => addressBottomSheet.current.close()}
                // onPress={() => {
                //   try {
                //     if (
                //       paymentMethodBottomSheet.current &&
                //       successBottomSheet.current
                //     ) {
                //       // Close the bottom sheet after 0 milliseconds
                //       paymentMethodBottomSheet.current.close();

                //       // Wait for 3 seconds before opening the success sheet
                //       setTimeout(() => {
                //         successBottomSheet.current.open();
                //       }, 3000);
                //     } else {
                //       console.error(
                //         "PaymentMethodBottomSheet or SuccessBottomSheet is not properly defined."
                //       );
                //     }
                //   } catch (error) {
                //     console.error("Error:", error);
                //   }
                // }}
              />
            </View>
          </View>
        </RBSheet>
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
                    style={[styles.applyBtn,{width:150}]}
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
                    title={t("Go to my order")}
                    filled
                    style={[styles.applyBtn]}
                    onPress={() => {
                      
                      setModalVisibleForOrder(false)
                      navigation.navigate("(tabs)",{
                        screen:"createorder"
                      })
                    }}
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
                    style={[
                      styles.icon,
                      {
                        tintColor: COLORS.primary,
                      },
                    ]}
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
    padding: 16,
    marginVertical: 8,
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
    width: 72,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
  },
  statusBtnText: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  headerLogo: {
    height: 36,
    width: 36,
    tintColor: COLORS.primary,
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

export default Checkout;

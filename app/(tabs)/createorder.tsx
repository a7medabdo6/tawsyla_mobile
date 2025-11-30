import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageSourcePropType,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { COLORS, icons, images } from "@/constants";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useOrdersInfinite } from "@/data/useOrders";
import OrderCard from "@/components/OrderCard";
import NoDataFound from "@/components/NoDataFound";
import LoginCard from "@/components/LoginCard";
import { useAuthStatus } from "@/data";
import { OrderStatus } from "../myordertrack";
import TabScreenWrapper from "@/components/TabScreenWrapper";
import OrdersSkeleton from "@/components/OrdersSkeleton";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import moment from "moment";

const MyOrder = () => {
  const { data: authData } = useAuthStatus();
  const navigation = useNavigation<NavigationProp<any>>();

  const { t, isRTL } = useLanguageContext();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useOrdersInfinite(5); // 5 products per page
  const allOrders = data?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Order status configuration
  const ORDER_STATUS_STEPS = [
    {
      key: OrderStatus.PENDING,
      label: { en: "Pending", ar: "قيد الانتظار" },
    },
    {
      key: OrderStatus.CONFIRMED,
      label: { en: "Confirmed", ar: "تم التأكيد" },
    },
    {
      key: OrderStatus.PROCESSING,
      label: { en: "Processing", ar: "جارٍ المعالجة" },
    },
    {
      key: OrderStatus.SHIPPED,
      label: { en: "Shipped", ar: "تم الشحن" },
    },
    {
      key: OrderStatus.DELIVERED,
      label: { en: "Delivered", ar: "تم التوصيل" },
    },
    {
      key: OrderStatus.CANCELLED,
      label: { en: "Cancelled", ar: "تم الإلغاء" },
    },
    {
      key: OrderStatus.REFUNDED,
      label: { en: "Refunded", ar: "تم الاسترداد" },
    },
  ];

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

  const renderOrderCard = ({ item, index }: { item: any; index: number }) => {
    const orderNumber =
      item?.orderNumber || item?.id?.toString() || `#${item?.id || "N/A"}`;
    const orderDate = item?.createdAt
      ? moment(item.createdAt).format("YYYY-MM-DD")
      : "N/A";
    const itemsCount = item?.items?.length || item?.orderItems?.length || 0;
    const totalPrice = item?.total || item?.totalPrice || 0;
    const status = item?.status || OrderStatus.PENDING;
    const statusLabel = getStatusLabel(status);
    const statusColor = getStatusColor(status);

    return (
      <OrderCard
        index={index}
        title={orderNumber}
        subtitle={`${orderDate} • ${itemsCount} ${t("Items")}`}
        price={`${totalPrice} ${t("EGP")}`}
        status={statusLabel}
        statusColor={statusColor}
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

  /**
   * render header
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
            {t("My Orders")}
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

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

  return (
    <TabScreenWrapper>
      <StatusBar hidden={true} />
      {renderHeader()}
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8f9fa",
          paddingHorizontal: 16,
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: 0,
            marginBottom: 70,
          }}
        >
          {!authData?.user ? (
            <LoginCard text={"You must login to view your Orders"} />
          ) : (
            <>
              {isLoading ? (
                <OrdersSkeleton />
              ) : (
                <>
                  {allOrders?.length === 0 ? (
                    <NoDataFound
                      title="لا توجد طلبات"
                      subtitle="لم تقم بإنشاء أي طلبات بعد. ابدأ التسوق الآن!"
                      buttonText="ابدأ التسوق"
                      icon={icons.document as any}
                      onButtonPress={() => navigation.navigate("allproducts")}
                    />
                  ) : (
                    <FlatList
                      data={allOrders}
                      keyExtractor={(item: any) =>
                        item?.id?.toString() || Math.random().toString()
                      }
                      renderItem={renderOrderCard}
                      numColumns={1}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.listContainer}
                      onEndReached={handleLoadMore}
                      onEndReachedThreshold={0.1}
                      ListFooterComponent={renderFooter}
                      refreshControl={
                        <RefreshControl
                          refreshing={isRefetching}
                          onRefresh={handleRefresh}
                          colors={[COLORS.primary]}
                          tintColor={COLORS.primary}
                        />
                      }
                    />
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    </TabScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 4,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  headerContainer: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
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
    marginHorizontal: 12,
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
  outlineButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: "bold",
  },
  filledButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  filledButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "bold",
  },
});
export default MyOrder;

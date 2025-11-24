import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  StatusBar,
  ImageSourcePropType,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, icons, images } from "@/constants";
import { FromMeRoute, ToMeRoute } from "@/tabs";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useOrders, useOrdersInfinite } from "@/data/useOrders";
import OrderCard from "@/tabs/FromMeRoute";
import NoDataFound from "@/components/NoDataFound";
import LoginCard from "@/components/LoginCard";
import { useAuthStatus } from "@/data";
import { OrderStatus } from "../myordertrack";

const MyOrder = () => {
  const layout = useWindowDimensions();
  const { data: authData } = useAuthStatus();

  const { t, isRTL } = useLanguageContext();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useOrdersInfinite(5); // 5 products per page
  const allOrders = data?.pages.flatMap((page) => page.data) || [];
  console.log(data, "datadatadatadata");

  // console.log(allOrders?.[0]?.id, "datadata");
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    refetch();
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <StatusBar hidden={true} />
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        {renderHeader()}
        <View
          style={{
            flex: 1,
            marginHorizontal: 15,
            alignItems: "center",
            marginBottom: 70,
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!authData?.user ? (
            <LoginCard text={"You must login to view your Orders"} />
          ) : (
            <>
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                  style={{ marginTop: 20 }}
                />
              ) : (
                <>
                  <>
                    {allOrders?.length === 0 && <NoDataFound />}
                    <FlatList
                      data={allOrders}
                      keyExtractor={(item: any) => item.id.toString()}
                      renderItem={({ item, index }: any) => (
                        <OrderCard item={item} />
                      )}
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
                      ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>
                            لا توجد منتجات متاحة
                          </Text>
                        </View>
                      }
                    />
                  </>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 8,
    paddingVertical: 16,
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
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
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
});
export default MyOrder;

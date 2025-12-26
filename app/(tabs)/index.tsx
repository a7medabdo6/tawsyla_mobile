import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-virtualized-view";
import { COLORS, SIZES, icons, images } from "@/constants";
import { Image } from "expo-image";
import { NavigationProp } from "@react-navigation/native";
import SubHeaderItem from "@/components/SubHeaderItem";
import { useAuthStatus } from "@/data";
import TabScreenWrapper from "@/components/TabScreenWrapper";
import { useNavigation, useFocusEffect } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { useLanguageContext } from "@/contexts/LanguageContext";
import CategoryCarousel from "@/components/CategoryList";
import Spinner from "react-native-loading-spinner-overlay";
import { useBanners } from "@/data/useHome";
import ProductHomeList from "@/components/ProductHomeList";
import { useAppStatus } from "@/data/useAppStatus";
import MasterCategory from "@/components/MasterCategory";
import DrawerFilter from "@/components/drawer";
import { Drawer } from "react-native-drawer-layout";
import Skeleton from "@/components/Skeleton";

const { width } = Dimensions.get("window");

const RenderWalletCard = ({ item }: any) => {
  return (
    <View style={styles.item}>
      <Image
        style={styles.cardContainer}
        source={{ uri: `https://api.waslha.net${item.image?.path}` }}
        resizeMode="cover"
      />
    </View>
  );
};

const CarouselExample = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, isLoading } = useBanners();

  if (isLoading) {
    return (
      <View style={styles.containerCar}>
        <Skeleton width={width - 32} height={180} borderRadius={10} />
      </View>
    );
  }

  return (
    <View
      style={{
        ...styles.containerCar,
        display: data?.length > 0 ? "flex" : "flex",
      }}
    >
      <Carousel
        loop
        width={width}
        height={180}
        onSnapToItem={(index) => setCurrentIndex(index)}
        autoPlay={false}
        data={data}
        autoPlayReverse={true}
        pagingEnabled
        scrollAnimationDuration={1000}
        renderItem={({ index, item }) => <RenderWalletCard item={item} />}
      />
      <View style={styles.pagination}>
        {data?.map((_: any, index: any) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isRTL } = useLanguageContext();
  const [loader] = useState(false);
  const { data: authStatus } = useAuthStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const { refetch } = useAppStatus();
  const [open, setOpen] = useState(false);
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  // Refetch app status each time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  /**
   * Render header
   */ // CarouselExample.tsx

  const renderHeader = () => {
    return (
      <View
        style={[styles.headerContainer, { direction: isRTL ? "rtl" : "ltr" }]}
      >
        {authStatus?.user ? (
          <View style={styles.viewLeft}>
            <View style={styles.userIconWrapper}>
              <Image
                source={images.user1}
                contentFit="cover"
                style={styles.userIcon}
              />
            </View>
            <View style={styles.viewNameContainer}>
              <Text style={styles.greeting}>مرحباً بك 👋</Text>
              <Text
                style={[
                  styles.title,
                  {
                    color: COLORS.greyscale900,
                  },
                ]}
              >
                {authStatus?.user?.firstName}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.viewLeft}>
            <TouchableOpacity
              onPress={() => navigation.navigate("login")}
              style={styles.loginPromptContainer}
            >
              <View style={styles.userIconWrapper}>
                <Image
                  source={images.user1}
                  contentFit="cover"
                  style={styles.userIcon}
                />
              </View>
              <View style={styles.viewNameContainer}>
                <Text style={styles.greeting}>مرحباً! 👋</Text>
                <Text style={styles.loginPromptText}>سجل دخولك الآن</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.viewRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("notifications")}
            style={styles.notificationButton}
          >
            <Image
              source={icons.notificationBell2}
              contentFit="contain"
              style={[styles.bellIcon, { tintColor: COLORS.greyscale900 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Render search bar
   */
  const renderSearchBar = () => {
    return (
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={{ width: "85%" }}
          onPress={() => setOpen((prevOpen) => !prevOpen)}
        >
          <View style={styles.searchBarContainer}>
            <Image
              source={icons.search2}
              contentFit="contain"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="البحث عن منتج  ..."
              placeholderTextColor={COLORS.gray}
              style={styles.searchInput}
              value={searchQuery}
              editable={false}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Image
                  source={icons.close}
                  contentFit="contain"
                  style={styles.clearIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setOpen((prevOpen) => !prevOpen)}
        >
          <Image
            source={icons.filter}
            contentFit="contain"
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Drawer
      style={{
        direction: "rtl",
      }}
      direction="rtl"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => (
        <DrawerFilter
          navigation={navigation}
          setSwipeEnabled={setSwipeEnabled}
        />
      )}
      drawerPosition="right"
      drawerStyle={{ width: "80%", paddingTop: 50 }}
      swipeEnabled={swipeEnabled}
      // drawerLockMode={swipeEnabled ? "unlocked" : "locked-closed"}
    >
      <TabScreenWrapper>
        {renderHeader()}
        <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
          <Spinner
            visible={loader}
            // textContent={"Loading..."}
            color={COLORS.white}
            textStyle={styles.spinnerTextStyle}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderSearchBar()}
            <CarouselExample />
            {/* <View style={styles.categoriesSection}>
              <SubHeaderItem
                title="اكتشف وصلها"
                onPress={() => navigation.navigate("allcategories")}
              />
              <MasterCategory />
            </View> */}
            <View style={styles.categoriesSection}>
              <SubHeaderItem
                title="جميع الاقسام"
                navTitle="عرض الكل"
                onPress={() => navigation.navigate("allcategories")}
              />
              <CategoryCarousel />
            </View>
            <View style={styles.productsSection}>
              <SubHeaderItem
                title="المنتجات المميزة"
                navTitle="عرض الكل"
                onPress={() => navigation.navigate("allproducts")}
              />
              <ProductHomeList />
            </View>
          </ScrollView>
        </View>
      </TabScreenWrapper>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.paleGreenDark,
    borderWidth: 2,
    borderRadius: 14,
    height: 48,
    width: "100%",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    textAlign: "right",
  },
  filterButton: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 11,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  containerCar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.paleGreenDark,
  },
  userIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  userIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  viewNameContainer: {
    marginHorizontal: 12,
    flex: 1,
  },
  loginPromptContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.paleGreen,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.paleGreenDark,
  },
  bellIcon: {
    height: 22,
    width: 22,
    tintColor: COLORS.black,
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 12,
    marginTop: 16,
    height: 150,
    // backgroundColor: COLORS.primary,
    padding: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  topCardLeftContainer: {
    marginTop: 6,
  },
  topCardRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  cardHolderName: {
    fontSize: 22,
    color: COLORS.black,
    fontFamily: "bold",
  },
  cardNumber: {
    fontSize: 20,
    color: COLORS.black,
    fontFamily: "semiBold",
  },
  cardType: {
    fontSize: 26,
    color: COLORS.white,
    fontFamily: "extraBoldItalic",
  },
  cardLogo: {
    height: 52,
    width: 52,
    marginLeft: 6,
  },
  balanceText: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: "medium",
  },
  bottomCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  amountNumber: {
    fontSize: 42,
    color: COLORS.white,
    fontFamily: "bold",
  },
  topupBtn: {
    width: 132,
    height: 42,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  arrowDown: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
  },
  topupBtnText: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: "semiBold",
    marginLeft: 12,
  },

  rowContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  serviceContainer: {
    width: (SIZES.width - 52) / 2,
    height: 120,
    borderWidth: 1,
    borderColor: "rgba(34, 187, 156, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(34, 187, 156, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
  },
  serviceTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: "semiBold",
    textAlign: "center",
    marginTop: 8,
  },
  spinnerTextStyle: {
    color: COLORS.primary,
  },
  productsSection: {},
  categoriesSection: {},
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
  },
});

export default Home;

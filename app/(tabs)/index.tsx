import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import { COLORS, SIZES, icons, images } from "@/constants";
import { Image } from "expo-image";
import { NavigationProp } from "@react-navigation/native";
import SubHeaderItem from "@/components/SubHeaderItem";
import { transactionHistory, useAuthStatus } from "@/data";
import TransactionHistoryCard from "@/components/TransactionHistoryCard";
import { useNavigation, useFocusEffect } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { useLanguageContext } from "@/contexts/LanguageContext";
import CategoryCarousel from "@/components/CategoryList";
import Spinner from "react-native-loading-spinner-overlay";
import ProductCard from "@/components/Product";
import { useBanners, useProducts } from "@/data/useHome";
import ProductHomeList from "@/components/ProductHomeList";
import { useAppStatus } from "@/data/useAppStatus";
import { useQueryClient } from "@tanstack/react-query";
import MasterCategory from "@/components/MasterCategory";
import DrawerFilter from "@/components/drawer";
import { Drawer } from "react-native-drawer-layout";
const orange = require("../../assets/images/orange.png");

const Home = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();
  const [loader, setLoader] = useState(false);
  const queryClient = useQueryClient();
  const { data: authStatus, isLoading } = useAuthStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: appStatus, refetch } = useAppStatus();
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

  const { width } = Dimensions.get("window");

  const colors = ["#FF6B6B", "#4ECDC4", "#1A535C", "#FFFCB9"];
  const RenderWalletCard = ({ item }: any) => {
    // console.log(item.image?.path,'itemitem');
    return (
      <View style={styles.item}>
        <Image
          style={styles.cardContainer}
          source={{ uri: `http://159.65.75.17:3000${item.image?.path}` }}
           resizeMode="cover"
        />

         
        {/* </ImageBackground> */}
      </View>
    );
  };
  const CarouselExample = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data } = useBanners();

    return (
      <View style={{...styles.containerCar,display:data?.length > 0 ? "flex" : "flex"}}>
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

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {authStatus?.user ? (
          <View style={styles.viewLeft}>
            <Image
              source={images.user1}
              contentFit="contain"
              style={styles.userIcon}
            />
            <View style={styles.viewNameContainer}>
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
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Image
                source={images.user1}
                contentFit="contain"
                style={styles.userIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.viewRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("notifications")}
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
   * Render wallet card
   */

  /**
   * Render search bar
   */
  const renderSearchBar = () => {
    const handleInputFocus = () => {
      // Redirect to another screen
      // navigation.navigate("trackidnumber");
    };

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
          // onPress={() => navigation.navigate("filters" as any)}
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

  // const renderServices = () => {
  //   return (
  //     <View>
  //       <View style={styles.rowContainer}>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("orderform")}
  //           style={styles.serviceContainer}
  //         >
  //           <View style={styles.iconContainer}>
  //             <Image
  //               source={icons.editService2}
  //               contentFit="contain"
  //               style={styles.icon}
  //             />
  //           </View>
  //           <Text
  //             style={[
  //               styles.serviceTitle,
  //               {
  //                 color: COLORS.black,
  //               },
  //             ]}
  //           >
  //             Make Order
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("checkrates")}
  //           style={styles.serviceContainer}
  //         >
  //           <View style={styles.iconContainer}>
  //             <Image
  //               source={icons.dollarSymbol}
  //               contentFit="contain"
  //               style={styles.icon}
  //             />
  //           </View>
  //           <Text
  //             style={[
  //               styles.serviceTitle,
  //               {
  //                 color: COLORS.black,
  //               },
  //             ]}
  //           >
  //             Check Rates
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //       <View style={styles.rowContainer}>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("nearbydrop")}
  //           style={styles.serviceContainer}
  //         >
  //           <View style={styles.iconContainer}>
  //             <Image
  //               source={icons.pin}
  //               contentFit="contain"
  //               style={styles.icon}
  //             />
  //           </View>
  //           <Text
  //             style={[
  //               styles.serviceTitle,
  //               {
  //                 color: COLORS.black,
  //               },
  //             ]}
  //           >
  //             Nearby Drop
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("settingshelpcenter")}
  //           style={styles.serviceContainer}
  //         >
  //           <View style={styles.iconContainer}>
  //             <Image
  //               source={icons.dollarSymbol}
  //               contentFit="contain"
  //               style={styles.icon}
  //             />
  //           </View>
  //           <Text
  //             style={[
  //               styles.serviceTitle,
  //               {
  //                 color: COLORS.black,
  //               },
  //             ]}
  //           >
  //             Help Center
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };
  /**
   * render transaction history
   */
  // const renderTransactionHistory = () => {
  //   return (
  //     <View>
  //       <SubHeaderItem
  //         title="Transaction History"
  //         navTitle="See All"
  //         onPress={() => navigation.navigate("transactionhistory")}
  //       />
  //       <FlatList
  //         data={transactionHistory.slice(0, 5)}
  //         keyExtractor={(item) => item.id}
  //         renderItem={({ item }) => (
  //           <TransactionHistoryCard
  //             title={item.title}
  //             description={item.description}
  //             date={item.date}
  //             type={item.type}
  //             onPress={() => console.log("Click")}
  //           />
  //         )}
  //       />
  //     </View>
  //   );
  // };
 

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => <DrawerFilter navigation={navigation} setSwipeEnabled={setSwipeEnabled} />}
      drawerPosition="right"
      drawerStyle={{ width: '80%' }}
      swipeEnabled={swipeEnabled}
      
      // drawerLockMode={swipeEnabled ? "unlocked" : "locked-closed"}

    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
          <Spinner
            visible={loader}
            // textContent={"Loading..."}
            color={COLORS.white}
            textStyle={styles.spinnerTextStyle}
          />
          {renderHeader()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderSearchBar()}
            <CarouselExample />
            <View style={styles.categoriesSection}>
              <SubHeaderItem
                title="اكتشف وصلها"
                onPress={() => navigation.navigate("allcategories")}
              />
              <MasterCategory />
            </View>
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
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <ProductHomeList />
              </View>
            </View>

            {/* {renderWalletCard()} */}
            {/* {renderServices()}
            {renderTransactionHistory()} */}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    // paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    // backgroundColor: COLORS.paleGreen,
    // backgroundColor: "#ccc",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.paleGreenDark,
    borderWidth: 2,
    borderRadius: 14,
    // paddingHorizontal: 16,
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
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userIcon: {
    width: 35,
    height: 35,
    borderRadius: 32,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeeting: {
    fontSize: 12,
    fontFamily: "regular",
    color: "gray",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  viewNameContainer: {
    marginHorizontal: 12,
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
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
    justifyContent:"center",
    alignItems:"center"

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
  productsSection: {
    // marginVertical: 20,
  },
  categoriesSection: {
    // marginVertical: 20,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    // tintColor: COLORS.gray,
  },
});

export default Home;

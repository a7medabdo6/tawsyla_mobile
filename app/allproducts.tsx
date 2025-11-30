import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "@/constants";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { useProductsInfinite, useCategories } from "@/data/useHome";
import ProductCard from "@/components/Product";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { NavigationProp } from "@react-navigation/native";
import CategoryCarousel from "@/components/CategoryList";
import { Drawer } from "react-native-drawer-layout";
import DrawerFilter from "@/components/drawer";
import Header from "@/components/Header";

const AllProducts = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, isRTL } = useLanguageContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "10", max: "100" });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("");
  const [open, setOpen] = useState(false);
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  // Set initial category from params if passed
  React.useEffect(() => {
    if (params.categoryId) {
      setSelectedCategory(params.categoryId as string);
    }
  }, [params.categoryId]);

  // Handle filters from Filters screen
  React.useEffect(() => {
    if (params.filters) {
      try {
        const filters = JSON.parse(params.filters as string);
        if (filters.category) {
          setSelectedCategory(filters.category); // Use first category for now
        }
        if (filters.priceRange) {
          setPriceRange(filters.priceRange);
        }
        if (filters.rating) {
          setSelectedRating(filters.rating);
        }
        if (filters.sortBy) {
          setSortBy(filters.sortBy);
        }
        if (filters.searchQuery) {
          setSearchQuery(filters.searchQuery);
        }
      } catch (error) {
        console.log("Error parsing filters:", error);
      }
    }
  }, [params.filters]);

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useProductsInfinite(
    8,
    debouncedSearch,
    selectedCategory,
    priceRange,
    selectedRating,
    sortBy
  ); // 5 products per page

  // Flatten all pages data
  const allProducts = data?.pages.flatMap((page) => page.data) || [];

  const renderSearchBar = () => {
    return (
      <View style={styles.searchContainer}>
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

  const renderProduct = ({ item }: any) => (
    <ProductCard
      name={item?.nameAr || item?.nameEn}
      image={
        item.image?.path
          ? `http://159.65.75.17:3000/api/v1/files${item.image.path}`
          : undefined
      }
      style={{
        width: "45%",
      }}
      price="2.99"
      rating={item?.rating}
      varints={item?.variants}
      productId={item?.id}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
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
            searchQueryProp={searchQuery}
            selectedCategoryProp={selectedCategory}
            priceRangeProp={priceRange}
            selectedRatingProp={selectedRating}
            sortByProp={sortBy}
          />
        )}
        drawerPosition="right"
        drawerStyle={{ width: "80%", paddingTop: 50 }}
        swipeEnabled={swipeEnabled}
      >
        <SafeAreaView style={styles.area}>
          <View
            style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
          >
            {/* {renderHeader()} */}
            <Header title="جميع المنتجات" />
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>جاري تحميل المنتجات...</Text>
            </View>
          </View>
        </SafeAreaView>
      </Drawer>
    );
  }

  if (error) {
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
            searchQueryProp={searchQuery}
            selectedCategoryProp={selectedCategory}
            priceRangeProp={priceRange}
            selectedRatingProp={selectedRating}
            sortByProp={sortBy}
          />
        )}
        drawerPosition="right"
        drawerStyle={{ width: "80%", paddingTop: 50 }}
        swipeEnabled={swipeEnabled}
      >
        <SafeAreaView style={styles.area}>
          <View
            style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
          >
            {/* {renderHeader()} */}
            <Header title="جميع المنتجات" />
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>حدث خطأ في تحميل المنتجات</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Drawer>
    );
  }

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
          searchQueryProp={searchQuery}
          selectedCategoryProp={selectedCategory}
          priceRangeProp={priceRange}
          selectedRatingProp={selectedRating}
          sortByProp={sortBy}
        />
      )}
      drawerPosition="right"
      drawerStyle={{ width: "80%", paddingTop: 50 }}
      swipeEnabled={swipeEnabled}
    >
      <SafeAreaView style={styles.area}>
        <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
          {/* {renderHeader()} */}
          <Header title="جميع المنتجات" />
          {renderSearchBar()}

          <FlatList
            data={allProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
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
                <Text style={styles.emptyText}>لا توجد منتجات متاحة</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </Drawer>
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
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
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
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    // backgroundColor: COLORS.paleGreen,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.paleGreenDark,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    width: "85%",
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
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    // tintColor: COLORS.gray,
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
    // textAlign: "right",
  },
  categoriesList: {
    paddingRight: 0,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.paleGreen,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
  },
  categoryChipTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default AllProducts;

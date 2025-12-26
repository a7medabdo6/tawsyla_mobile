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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCategories } from "@/data/useHome";
import { useLanguageContext } from "@/contexts/LanguageContext";
import Skeleton from "@/components/Skeleton";
import Header from "@/components/Header";

const AllCategories = () => {
  const router = useRouter();
  const { t, isRTL } = useLanguageContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const params = useLocalSearchParams();
  const [selectedMasterCategory, setSelectedMasterCategory] = useState("");
  const [selectedMasterCategoryName, setSelectedMasterCategoryName] =
    useState("");

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    if (params.masterId) {
      setSelectedMasterCategory(params.masterId as string);
      setSelectedMasterCategoryName(params.masterName as string);
    }
  }, [params.masterId]);

  // Get categories
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useCategories({ masterId: selectedMasterCategory });

  const allCategories = categoriesData || [];

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
            placeholder="البحث في الاقسام..."
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
      </View>
    );
  };

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => {
        // Navigate to products filtered by this category
        router.push({
          pathname: "/allproducts",
          params: {
            categoryId: item.id,
            categoryName: item.nameAr || item.nameEn,
          },
        });
      }}
    >
      <View style={styles.categoryIconContainer}>
        {item.image?.path ? (
          <Image
            source={{ uri: `https://api.waslha.net${item.image.path}` }}
            contentFit="cover"
            style={styles.categoryImage}
          />
        ) : (
          <Image
            source={icons.sample}
            contentFit="cover"
            style={styles.categoryImage}
          />
        )}
      </View>
      <Text style={styles.categoryName}>{item.nameAr || item.nameEn}</Text>
    </TouchableOpacity>
  );

  const renderSkeletonCategory = () => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryIconContainer}>
        <Skeleton width="100%" height="100%" borderRadius={16} />
      </View>
      <Skeleton
        width="80%"
        height={14}
        borderRadius={4}
        style={{ marginTop: 8 }}
      />
    </View>
  );

  const renderSkeletonLoader = () => (
    <SafeAreaView style={styles.area}>
      <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
        {/* Skeleton Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Skeleton width={36} height={36} borderRadius={8} />
            <Skeleton
              width={150}
              height={20}
              borderRadius={4}
              style={{ marginRight: 12 }}
            />
          </View>
        </View>

        {/* Skeleton Search Bar */}
        <View style={styles.searchContainer}>
          <Skeleton width="100%" height={48} borderRadius={12} />
        </View>

        {/* Skeleton Category Grid */}
        <View style={styles.listContainer}>
          <View style={styles.skeletonGrid}>
            {[...Array(9)].map((_, index) => (
              <View key={index} style={styles.skeletonCategoryWrapper}>
                {renderSkeletonCategory()}
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  const handleRefresh = () => {
    refetch();
  };

  // Filter categories based on search
  const filteredCategories = allCategories.filter((category: any) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    const nameAr = (category.nameAr || "").toLowerCase();
    const nameEn = (category.nameEn || "").toLowerCase();
    const descAr = (category.descriptionAr || "").toLowerCase();
    const descEn = (category.descriptionEn || "").toLowerCase();

    return (
      nameAr.includes(searchLower) ||
      nameEn.includes(searchLower) ||
      descAr.includes(searchLower) ||
      descEn.includes(searchLower)
    );
  });

  if (isLoading) {
    return renderSkeletonLoader();
  }

  if (error) {
    return (
      <SafeAreaView style={styles.area}>
        <View style={{ direction: isRTL ? "rtl" : "ltr" }}>
          <Header title="جميع الاقسام" />
        </View>
        <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
          {/* {renderHeader()} */}
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>حدث خطأ في تحميل التصنيفات</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <Header title="جميع الاقسام" />
      </View>
      <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
        {/* {renderHeader()} */}
        {renderSearchBar()}
        <FlatList
          data={filteredCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
                {debouncedSearch
                  ? "لا توجد تصنيفات تطابق البحث"
                  : "لا توجد تصنيفات متاحة"}
              </Text>
            </View>
          }
        />
      </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.paleGreenDark,
    borderWidth: 2,
    borderRadius: 12,
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
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.gray,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  categoryCard: {
    flex: 1,
    minWidth: 0,
    height: 210,
    borderRadius: 16,
    paddingHorizontal: 3,
    marginLeft: 3,
    alignItems: "center",
    position: "relative",
  },
  categoryIconContainer: {
    backgroundColor: COLORS.paleGreen,
    borderRadius: 16,
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 16,
  },
  categoryName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    width: "100%",
    paddingRight: 5,
    color: COLORS.black,
    textAlign: "center",
    position: "absolute",
    top: 15,
    left: 0,
    right: 0,
  },
  categoryDescription: {
    fontSize: 12,
    color: COLORS.gray,
    width: "100%",
    paddingRight: 5,
    textAlign: "center",
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skeletonCategoryWrapper: {
    width: "31%",
    marginBottom: 16,
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
});

export default AllCategories;

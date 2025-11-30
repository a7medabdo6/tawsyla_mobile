import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "@/constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCategories } from "@/data/useHome";
import { useLanguageContext } from "@/contexts/LanguageContext";
import Label from "@/components/RangeSlider/Label";
import Notch from "@/components/RangeSlider/Notch";
import Rail from "@/components/RangeSlider/Rail";
import RailSelected from "@/components/RangeSlider/RailSelected";
import Thumb from "@/components/RangeSlider/Thumb";
import RangeSliderRN from "rn-range-slider";

const Filters = () => {
  const router = useRouter();
  const { t, isRTL } = useLanguageContext();
  const { data: categoriesData } = useCategories({});

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [priceRange, setPriceRange] = useState({ min: -100, max: -1 });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("");

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo}
            contentFit="contain"
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
            الفلترة
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedCategory(null);
              setPriceRange({ min: 100, max: 1 });
              setSelectedRating(null);
              setSortBy("");
            }}
          >
            <Text style={styles.clearButtonText}>مسح الكل</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCategories = () => {
    if (!categoriesData || categoriesData.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image
            source={icons.category}
            contentFit="contain"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>التصنيفات</Text>
        </View>
        <View style={styles.categoriesGrid}>
          {categoriesData.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory == category.id && styles.categoryChipActive,
              ]}
              onPress={() => {
                if (selectedCategory == category.id) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(category?.id);
                }
              }}
            >
              {selectedCategory == category.id && (
                <View style={styles.checkmarkContainer}>
                  <Image
                    source={icons.check}
                    contentFit="contain"
                    style={styles.checkmarkIcon}
                  />
                </View>
              )}
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory == category.id &&
                    styles.categoryChipTextActive,
                ]}
              >
                {category.nameAr || category.nameEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderPriceRange = () => {
    const handleValueChange = useCallback((low: any, high: any) => {
      setPriceRange({ min: -low, max: -high });
    }, []);
    const renderThumb = useCallback(() => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const renderLabel = useCallback((value: any) => <Label text={value} />, []);
    const renderNotch = useCallback(() => <Notch />, []);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image
            source={icons.dollarSymbol}
            contentFit="contain"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>نطاق السعر</Text>
        </View>
        <View style={styles.priceContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 5,
              //   direction:"rtl"
            }}
          >
            <View>
              <Text
                style={[
                  { fontStyle: "italic" },
                  { textAlign: "left", fontSize: 14, color: "#D2D2D2" },
                ]}
              >
                {t("Mini")}
              </Text>
              <Text
                style={[
                  { fontWeight: "bold" },
                  { fontSize: 18, color: "#000000" },
                ]}
              >
                {priceRange?.min} {t("EGP")}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  { fontStyle: "italic" },
                  { textAlign: "right", fontSize: 14, color: "#D2D2D2" },
                ]}
              >
                {t("Max")}
              </Text>
              <Text
                style={[
                  { fontWeight: "bold" },
                  { fontSize: 18, color: "#000000" },
                ]}
              >
                {priceRange?.max} {t("EGP")}
              </Text>
            </View>
          </View>
          <RangeSliderRN
            style={styles.slider}
            min={-100}
            max={-1}
            step={1}
            floatingLabel
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            // renderLabel={renderLabel}
            // renderNotch={renderNotch}
            onValueChanged={handleValueChange}
          />
        </View>
      </View>
    );
  };

  const renderRating = () => {
    const ratings = [5, 4, 3, 2, 1];

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image
            source={icons.heart}
            contentFit="contain"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>التقييم</Text>
        </View>
        <View style={styles.ratingContainer}>
          {ratings.map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingChip,
                selectedRating === rating && styles.ratingChipActive,
              ]}
              onPress={() =>
                setSelectedRating(selectedRating === rating ? null : rating)
              }
            >
              <View style={styles.starsContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Text
                    key={index}
                    style={[styles.star, index < rating && styles.starActive]}
                  >
                    ★
                  </Text>
                ))}
              </View>
              <Text
                style={[
                  styles.ratingChipText,
                  selectedRating === rating && styles.ratingChipTextActive,
                ]}
              >
                {rating}+ نجوم
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderSortBy = () => {
    const sortOptions = [
      { id: "variants.price,DESC", name: "السعر: من الأقل إلى الأعلى" },
      { id: "variants.price,ASC", name: "السعر: من الأعلى إلى الأقل" },
      { id: "rating", name: "التقييم" },
      { id: "createdAt", name: "الأحدث" },
    ];

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginHorizontal: 10 }]}>
          ترتيب حسب
        </Text>
        <View style={styles.sortContainer}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortOption,
                sortBy === option.id && styles.sortOptionActive,
              ]}
              onPress={() => setSortBy(sortBy === option.id ? "" : option.id)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.sortOptionTextActive,
                ]}
              >
                {option.name}
              </Text>
              {sortBy === option.id && (
                <Image
                  source={icons.check}
                  contentFit="contain"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleApplyFilters = () => {
    // Navigate back to products with filter parameters
    router.push({
      pathname: "/allproducts" as any,
      params: {
        filters: JSON.stringify({
          category: selectedCategory,
          priceRange,
          rating: selectedRating,
          sortBy,
        }),
      },
    });
  };

  return (
    <SafeAreaView style={styles.area}>
      <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
        {renderHeader()}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderCategories()}
          {renderPriceRange()}
          {renderRating()}
          {renderSortBy()}
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>تطبيق الفلاتر</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: COLORS.paleGreen,
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
    marginRight: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
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
  checkmarkContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  checkmarkIcon: {
    width: 12,
    height: 12,
    tintColor: COLORS.white,
  },
  priceContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    gap: 12,
    direction: "ltr",
    marginHorizontal: 6,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  priceSeparator: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  priceSeparatorText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 6,
  },
  ratingChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  ratingChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ratingChipText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
  },
  ratingChipTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  sortContainer: {
    gap: 8,
    marginHorizontal: 6,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: COLORS.black,
  },
  sortOptionTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  checkIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  star: {
    fontSize: 16,
    color: COLORS.gray,
    marginRight: 2,
  },
  starActive: {
    color: "#FFD700",
  },
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    // marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pricePresets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.paleGreen,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  presetText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
  slider: {
    width: "100%", // Set the slider width to fit the screen
    // marginBottom: 20,
    direction: "ltr",
    borderColor: COLORS.primary,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  valueText: {
    fontSize: 16,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10, // Make the thumb circular
  },
  rail: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2, // Rounded rail
  },
  railSelected: {
    height: 4,
    backgroundColor: COLORS.primary, // Color for the selected rail
    borderRadius: 2, // Rounded selected rail
  },
});

export default Filters;

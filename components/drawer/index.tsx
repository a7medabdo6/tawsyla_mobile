import React, { useCallback, useState} from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";
import styles from "./styles";
// import RangeSlider from "@jesster2k10/react-native-range-slider";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { icons } from "@/constants";
import { images } from "@/constants";
import RangeSliderRN from "rn-range-slider";
import RailSelected from "../RangeSlider/RailSelected";
import Thumb from "../RangeSlider/Thumb";
import Rail from "../RangeSlider/Rail";
import { useLanguageContext } from "@/contexts/LanguageContext";
import SelectDropdown from "react-native-select-dropdown";
import { useRouter } from "expo-router";
import Notch from "../RangeSlider/Notch";
import Label from "../RangeSlider/Label";
const DrawerFilter = ({navigation,setSwipeEnabled,searchQueryProp,selectedCategoryProp,priceRangeProp,selectedRatingProp,sortByProp}:any) => {
    const { t, isRTL } = useLanguageContext();

    const [searchQuery, setSearchQuery] = useState(searchQueryProp || "");
const [selectedCategory, setSelectedCategory] = useState<string | null>(selectedCategoryProp);
const [priceRange, setPriceRange] = useState({ min: priceRangeProp?.min, max: priceRangeProp?.max });
const [selectedRating, setSelectedRating] = useState<number | null>(selectedRatingProp);
const [sortBy, setSortBy] = useState<string>(sortByProp);
    const router = useRouter();



const renderSortBy = () => {
  const sortOptions = [
    { id: "variants.price,DESC", name: "السعر: من الأقل إلى الأعلى" },
    { id: "variants.price,ASC", name: "السعر: من الأعلى إلى الأقل" },
    { id: "rating", name: "التقييم" },
    { id: "createdAt", name: "الأحدث" },
  ];

  const getSelectedSortOption = () => {
    return sortOptions.find(option => option.id === sortBy) || null;
  };

  return (
    <SelectDropdown
      data={sortOptions}
      onSelect={(selectedItem) => {
        setSortBy(selectedItem.id === sortBy ? "" : selectedItem.id);
      }}
      renderButton={(selectedItem, isOpened) => {
        const currentOption = selectedItem || getSelectedSortOption();
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {currentOption ? currentOption.name : "اختر طريقة الترتيب"}
            </Text>
            <MaterialIcons
              name={isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={COLORS.primary}
            />
          </View>
        );
      }}
      renderItem={(item:any, index:any, isSelected:any) => {
        return (
          <View
            style={[
              styles.dropdownItemStyle,
              isSelected && { backgroundColor: COLORS.tansparentPrimary },
            ]}
          >
            <Text
              style={[
                styles.dropdownItemTxtStyle,
                isSelected && { color: COLORS.primary, fontWeight: '600' },
              ]}
            >
              {item.name}
            </Text>
            {isSelected && (
              <MaterialIcons
                name="check-circle"
                size={20}
                color={COLORS.primary}
              />
            )}
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
      dropdownOverlayColor="transparent"
      statusBarTranslucent={true}
    />
  );
};
const renderRating = () => {
  const ratings = [
    { label: '5 نجوم', value: 5 },
    { label: '4 نجوم', value: 4 },
    { label: '3 نجوم', value: 3 },
    { label: 'نجمتان', value: 2 },
    { label: 'نجمة', value: 1 }
  ];

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={{
              color: star <= rating ? "#FFD700" : COLORS.gray,
              fontSize: 16,
              marginLeft: 2,
            }}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  return (
    <SelectDropdown
      data={ratings}
      onSelect={(selectedItem:any) => {
        setSelectedRating(selectedItem.value);
      }}
      renderButton={(selectedItem:any, isOpened:any) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            {selectedItem ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {renderStars(selectedItem.value)}
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem.label}
                </Text>
              </View>
            ) : (
              <Text style={styles.dropdownButtonTxtStyle}>اختر التقييم</Text>
            )}
            <MaterialIcons
              name={isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={COLORS.primary}
            />
          </View>
        );
      }}
      renderItem={(item:any, index:any, isSelected:any) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: COLORS.tansparentPrimary }),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {renderStars(item.value)}
              <Text style={[
                styles.dropdownItemTxtStyle,
                isSelected && { color: COLORS.primary, fontWeight: '600' }
              ]}>
                {item.label}
              </Text>
            </View>
            {isSelected && (
              <MaterialIcons
                name="check-circle"
                size={20}
                color={COLORS.primary}
              />
            )}
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};
const renderPriceRange = () => {

const handleValueChange = useCallback((low:any, high:any) => {
    setSwipeEnabled(false);
  setPriceRange({min:low,max:high});
}, []);
const renderThumb = useCallback(() => <Thumb />, []);
const renderRail = useCallback(() => <Rail />, []);
const renderRailSelected = useCallback(() => <RailSelected />, []);
const renderLabel = useCallback((value:any) => <Label text={value} />, []);
const renderNotch = useCallback(() => <Notch />, []);


        return (
            <View>
                <View style={styles.filterCardHeader}>
                    <View style={styles.filterIconContainer}>
                        <MaterialIcons name="payments" size={18} color={COLORS.primary} />
                    </View>
                    <Text style={styles.filterCardTitle}>نطاق السعر</Text>
                </View>
                <View style={styles.priceContainer}>
                <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 12,
        }}
      >
        <View style={styles.priceValueContainer}>
          <Text style={styles.priceValueLabel}>من</Text>
          <Text style={styles.priceValueText}>
            {priceRange?.min} {t("EGP")}
          </Text>
        </View>
        <View style={styles.priceValueContainer}>
          <Text style={styles.priceValueLabel}>الى</Text>
          <Text style={styles.priceValueText}>
            {priceRange?.max} {t("EGP")}
          </Text>
        </View>
      </View>
                <RangeSliderRN
         style={styles.slider}
         
        min={5}
        max={1000}
        low={priceRange.min}
        high={priceRange.max}
        step={1}
        floatingLabel 
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        onValueChanged={handleValueChange}
        onSliderTouchEnd={()=>setSwipeEnabled(true)}
      />
                
                </View>
            </View>
        );
    };
const handleApplyFilters = () => {
		// Navigate back to products with filter parameters
                                // navigation.closeDrawer();

		router.push({
			pathname: "/allproducts" as any,
			params: {
				filters: JSON.stringify({
                    searchQuery,
					priceRange,
					rating: selectedRating,
					sortBy,
				}),
			},
		});
	};

    return(
        <SafeAreaView style={[styles.container,{direction:'rtl', backgroundColor: COLORS.grayscale100}]}>
            <View style={styles.headerContainer}>
				<View style={styles.headerLeft}>
					<View style={styles.headerIconContainer}>
                        <MaterialIcons name="filter-list" size={24} color={COLORS.primary} />
                    </View>
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
				<TouchableOpacity
					style={styles.clearButtonContainer}
					onPress={() => {
						setSelectedCategory(null);
						setPriceRange({ min: 5, max: 1000 });
						setSelectedRating(null);
						setSortBy("");
                        setSearchQuery("");
					}}
				>
					<MaterialIcons name="refresh" size={20} color={COLORS.primary} />
					<Text style={styles.clearButtonText}>مسح الكل</Text>
				</TouchableOpacity>
			</View>
            
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Search Section */}
                <View style={styles.filterCard}>
                    <View style={styles.filterCardHeader}>
                        <View style={styles.filterIconContainer}>
                            <MaterialIcons name="search" size={18} color={COLORS.primary} />
                        </View>
                        <Text style={styles.filterCardTitle}>البحث</Text>
                    </View>
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
                            editable={true}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                                style={styles.clearSearchButton}
                            >
                                <MaterialIcons name="close" size={18} color={COLORS.gray} />
                            </TouchableOpacity>
                        )}
                    </View>                
                </View>
             
                {/* Sort By Section */}
                <View style={styles.filterCard}>
                    <View style={styles.filterCardHeader}>
                        <View style={styles.filterIconContainer}>
                            <MaterialIcons name="sort" size={18} color={COLORS.primary} />
                        </View>
                        <Text style={styles.filterCardTitle}>ترتيب حسب</Text>
                    </View>
                    {renderSortBy()}
                </View>
                
                {/* Rating Section */}
                <View style={styles.filterCard}>
                    <View style={styles.filterCardHeader}>
                        <View style={styles.filterIconContainer}>
                            <MaterialIcons name="star" size={18} color={COLORS.primary} />
                        </View>
                        <Text style={styles.filterCardTitle}>التقييم</Text>
                    </View>
                    {renderRating()}
                </View>
                
                {/* Price Range Section */}
                <View style={styles.filterCard}>
                    {renderPriceRange()}
                </View>
                
                {/* Apply Button */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApplyFilters}
                    >
                        <MaterialIcons name="check-circle" size={20} color={COLORS.white} />
                        <Text style={styles.applyButtonText}>تطبيق الفلاتر</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DrawerFilter;
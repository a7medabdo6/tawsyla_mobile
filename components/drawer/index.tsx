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
    <View style={styles.item}>
      <Text style={styles.title}>ترتيب حسب</Text>
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
                color={COLORS.gray}
              />
            </View>
          );
        }}
        renderItem={(item:any, index:any, isSelected:any) => {
          return (
            <View
              style={[
                styles.dropdownItemStyle,
                isSelected && { backgroundColor: COLORS.gray },
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
                  name="check"
                  size={18}
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
    </View>
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
              color: star <= rating ? COLORS.primary : COLORS.gray,
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
    <View style={styles.item}>
      <Text style={styles.title}>التقييم</Text>
      <SelectDropdown
        data={ratings}
        onSelect={(selectedItem:any) => {
          setSelectedRating(selectedItem.value);
        }}
        renderButton={(selectedItem:any, isOpened:any) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              {selectedItem ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                color={COLORS.gray}
              />
            </View>
          );
        }}
        renderItem={(item:any, index:any, isSelected:any) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: COLORS.gray }),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {renderStars(item.value)}
                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
              </View>
              {isSelected && (
                <MaterialIcons
                  name="check"
                  size={18}
                  color={COLORS.primary}
                />
              )}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
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
              { textAlign: "left", fontSize: 14, color: "#D2D2D2" }
            ]}
          >
            من
          </Text>
          <Text
            style={[{ fontWeight: "bold" }, { fontSize: 18, color: "#000000" }]}
          >
            {priceRange?.min} {t("EGP")}
          </Text>
        </View>
        <View>
          <Text
            style={[
              { fontStyle: "italic" },
              { textAlign: "right", fontSize: 14, color: "#D2D2D2" }
            ]}
          >
                        الى

          </Text>
          <Text
            style={[{ fontWeight: "bold" }, { fontSize: 18, color: "#000000" }]}
          >
            {priceRange?.max} {t("EGP")}
          </Text>
        </View>
      </View>
                <RangeSliderRN
         style={styles.slider}
         
        min={10}
        max={100}
        low={priceRange.min}
        high={priceRange.max}
        step={1}
        floatingLabel 
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        // renderLabel={renderLabel}
        // renderNotch={renderNotch}
        onValueChanged={handleValueChange}
        onSliderTouchEnd={()=>setSwipeEnabled(true)}
        // onSlideEnd={() => setSwipeEnabled(true)}
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
        <SafeAreaView style={[styles.container,{direction:'rtl'}]}>
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
							setPriceRange({ min: 10, max: 100 });
							setSelectedRating(null);
							setSortBy("");
						}}
					>
						<Text style={styles.clearButtonText}>مسح الكل</Text>
					</TouchableOpacity>
				</View>
			</View>
            <ScrollView style={styles.container}>
                <View style={styles.item}>
                    <Text style={styles.title}>البحث</Text>
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
             
               
                {renderSortBy()}
                {renderRating()}
                <View style={styles.item}>
                    {renderPriceRange()}
                </View>
                {/* <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.closeDrawer();
                    }}
                >
                    <Text style={styles.buttonTxt}>Apply Filters</Text>
                </TouchableOpacity> */}
                <View style={styles.bottomContainer}>
                                    <TouchableOpacity
                                        style={styles.applyButton}
                                        onPress={handleApplyFilters}
                                    >
                                        <Text style={styles.applyButtonText}>تطبيق الفلاتر</Text>
                                    </TouchableOpacity>
                                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DrawerFilter;
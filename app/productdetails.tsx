import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "@/constants";
import { useLanguageContext } from "@/contexts/LanguageContext";
import ProductCard from "@/components/Product";
import { useNavigation } from "expo-router";
const { height, width } = Dimensions.get("window");

const renderItem = ({ item }: any) => {
  return (
    <ProductCard
      style={styles.relatedProduct}
      name={item?.name}
      image={item?.image}
      price={item?.price}
    />
  );
};
const ProductDetails = () => {
  const { t, isRTL } = useLanguageContext();
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigation = useNavigation();
  const productDescription = isRTL
    ? `البرتقال هو فاكهة حمضية نابضة بالحياة وعصيرية، معروفة بنكهتها المنعشة ولونها الزاهي. مع حلاوة لاذعة، تضيف انفجاراً من النضارة لكل من الأطباق الحلوة والمالحة. قشر البرتقال غالباً ما يستخدم في الطبخ والخبز لإضفاء نكهة`
    : `Orange is a vibrant and juicy citrus fruit, known for its refreshing flavor and bright color. With a tangy savory sweetness, it adds a burst of freshness to both sweet and savory dishes. The peel of an orange is often used in cooking and baking to impart a zesty`;

  const fullDescription = isRTL
    ? `${productDescription} لاذعة لمختلف الوصفات. غني بفيتامين C ومضادات الأكسدة، البرتقال ليس لذيذ فحسب بل مغذي أيضاً، مما يجعله خياراً شائعاً للأكل الصحي.`
    : `${productDescription} flavor to various recipes. Rich in vitamin C and antioxidants, oranges are not only delicious but also nutritious, making them a popular choice for healthy eating.`;

  const relatedProducts = [
    {
      id: 1,
      name: isRTL ? "تفاح" : "Apple",
      price: "3.99",
      image: require("@/assets/icons/apple.png"),
    },
    {
      id: 2,
      name: isRTL ? "برتقال" : "Orange",
      price: "2.99",
      image: require("@/assets/images/orange.png"),
    },
    {
      id: 3,
      name: isRTL ? "برتقال" : "Orange",
      price: "2.99",
      image: require("@/assets/images/orange.png"),
    },
    {
      id: 4,
      name: isRTL ? "برتقال" : "Orange",
      price: "2.99",
      image: require("@/assets/images/orange.png"),
    },
  ];

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(quantity + 1);
    } else if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleBack = () => {
    navigation.goBack();
  };
  const totalPrice = (2.99 * quantity).toFixed(2);

  return (
    <SafeAreaView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paleGreen} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.navigationBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <AntDesign
              name={isRTL ? "right" : "left"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isRTL ? "التفاصيل" : "Details"}
          </Text>
          <TouchableOpacity style={styles.notificationButton}>
            <AntDesign name="shoppingcart" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/orange.png")}
            style={styles.productImage}
          />
        </View>

        {/* Product Information */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName]}>
            {isRTL ? "برتقال طازج" : "Fresh Orange"}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={16}
                color={i < 4 ? "#FFD700" : "#DDD"}
              />
            ))}
          </View>

          {/* Price and Quantity */}
          <View style={styles.priceQuantityContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>$2.99</Text>
              <Text style={styles.priceUnit}>/{isRTL ? "كجم" : "KG"}</Text>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(false)}
              >
                <AntDesign name="minus" size={16} color="#000" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {quantity} {isRTL ? "كجم" : "KG"}
              </Text>
              <TouchableOpacity
                style={[styles.quantityButton, styles.plusButton]}
                onPress={() => handleQuantityChange(true)}
              >
                <AntDesign name="plus" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle]}>
              {isRTL ? "تفاصيل المنتج" : "Product Details"}
            </Text>
            <Text style={[styles.description]}>
              {showFullDescription ? fullDescription : productDescription}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text style={styles.readMore}>
                {showFullDescription
                  ? isRTL
                    ? "اقرأ أقل"
                    : "Read Less"
                  : isRTL
                  ? "اقرأ المزيد"
                  : "Read More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Related Products */}
          <View style={styles.relatedSection}>
            <Text style={[styles.sectionTitle]}>
              {isRTL ? "المنتجات ذات الصلة" : "Related Products"}
            </Text>
            <View style={{ direction: "ltr" }}>
              <FlatList
                horizontal
                data={relatedProducts}
                showsHorizontalScrollIndicator={false}
                style={styles.relatedScroll}
                renderItem={renderItem}
                // keyExtractor={(item) => item.id}
                inverted={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            {isRTL ? "السعر الإجمالي" : "Total Price"}
          </Text>
          <Text style={styles.totalPrice}>${totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>
            {isRTL ? "أضف إلى السلة" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.paleGreenDark,
    paddingTop: 10,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  dynamicIsland: {
    width: 120,
    height: 30,
    backgroundColor: COLORS.black,
    borderRadius: 15,
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  signalBars: {
    width: 20,
    height: 12,
    backgroundColor: COLORS.black,
    borderRadius: 2,
  },
  wifiIcon: {
    width: 16,
    height: 12,
    backgroundColor: COLORS.black,
    borderRadius: 1,
  },
  batteryIcon: {
    width: 24,
    height: 12,
    backgroundColor: COLORS.black,
    borderRadius: 2,
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    // backgroundColor:COLORS.paleGreenDark,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: COLORS.paleGreenDark,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  productInfo: {
    padding: 20,
    backgroundColor: COLORS.paleGreen,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: COLORS.grayscale200,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.grayscale200,
  },
  plusButton: {
    backgroundColor: COLORS.primary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    color: COLORS.black,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grayscale700,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  relatedSection: {
    marginBottom: 100, // Space for bottom bar
  },
  relatedScroll: {
    marginTop: 12,
  },
  relatedProduct: {
    width: width / 2,
    // marginRight: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    position: "relative",
    marginBottom: 40,
  },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  relatedImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: -2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 5,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 10,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    width: "65%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default ProductDetails;

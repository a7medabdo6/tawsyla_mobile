import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "@/constants";
import { useLanguageContext } from "@/contexts/LanguageContext";
import ProductCard from "@/components/Product";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { useAddToCart, useCart, useDeleteCartItem } from "@/data/useCart";
import { useAddFavourite, useDeleteFavourite } from "@/data/useFavourites";
import {
  getStoredCartProductIds,
  getStoredFavouriteProductIds,
} from "@/data/useAppStatus";
import { useProduct, useProducts } from "@/data/useHome";
import { isAuthenticated } from "@/data/useAuth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import Header from "@/components/Header";

const { height, width } = Dimensions.get("window");



const ProductDetails = () => {
  const { t, isRTL } = useLanguageContext();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [isAuth, setIsAuth] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const { data } = useCart();
  const params = useLocalSearchParams();
  const productId = params.productId as string;

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProduct(productId);
  const {
    data: relatedProducts,
    isLoading,
    error,
  } = useProducts(1, 10, product?.category?.id);
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const { mutateAsync: deleteItem } = useDeleteCartItem();
  const { mutateAsync: addFav } = useAddFavourite();
  const { mutateAsync: delFav } = useDeleteFavourite();

  useEffect(() => {
    const checkStatus = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      if (productId) {
        const [cartIds, favIds] = await Promise.all([
          getStoredCartProductIds(),
          getStoredFavouriteProductIds(),
        ]);
        setIsAdded(cartIds.includes(productId));
        setIsFav(favIds.includes(productId));
      }
    };
    checkStatus();
  }, [productId]);

  useEffect(() => {
    if (data?.items && productId) {
      const cartItem = data.items.find(
        (item: any) => item.productId === productId
      );
      if (cartItem) {
        setQuantity(cartItem.quantity);
        setIsAdded(true);
      } else {
        setQuantity(1);
        setIsAdded(false);
      }
    }
  }, [data, productId]);

  const getFirstVariantPrice = (variants: any) => {
    if (Array.isArray(variants) && variants.length > 0 && variants[0].price) {
      return variants[0].price;
    }
    return "0";
  };

  const handleAddToCart = async (qty: number) => {
    setQuantity(qty);
    try {
      if (!isAuth) {
        router.push("/login");
        return;
      }

      const firstVariantId =
        Array.isArray(product?.variants) && product?.variants.length > 0
          ? product?.variants[0]?.id
          : undefined;
      if (!productId || !firstVariantId) return;
      await addToCart({
        productId,
        variantId: firstVariantId,
        quantity: qty,
      });
      setIsAdded(true);
    } catch (error) {
      // console.log(error);
    }
  };

  const toggleFavourite = async () => {
    if (!productId) return;
    try {
      if (isFav) {
        await delFav(productId);
        setIsFav(false);
      } else {
        await addFav({ productId });
        setIsFav(true);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDeleteFromCart = async () => {
    if (!data?.items) return;
    const cartItem = data.items.find(
      (item: any) => item.productId === productId
    );
    if (cartItem?.id) {
      try {
        await deleteItem(cartItem.id);
        setIsAdded(false);
        setQuantity(1);
      } catch (error) {
        // console.log(error);
      }
    }
  };

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

  const totalPrice = (
    parseFloat(getFirstVariantPrice(product?.variants)) * quantity
  ).toFixed(2);
  const renderItem = ({ item }: any) => {
    // console.log(data?.items?.[0]?.productId,'dddddddddddddddddddata?.itemsdata?.itemsdata?.items');
    
    return (
      <ProductCard
        style={styles.relatedProduct}
        name={item?.nameAr}
        image={`https://api.waslha.net/api/v1/files${item?.image?.path}`}
        price={item?.variants[0]?.price}
        productId={item?.id}
        varints={item?.variants}
        cartItem={data?.items?.find((cartItem: any) => cartItem.productId === item?.id)}
      />
    );
  };
  if (productLoading) {
    return (
      <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (productError || !product) {
    return (
      <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load product</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      {/* <Header title={isRTL ? "التفاصيل" : "Details"} /> */}
      <View style={[styles.header, {    paddingVertical: 16,
    paddingHorizontal: 6,}]}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <Ionicons
            name={isRTL ? "chevron-forward" : "chevron-back"}
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? "التفاصيل" : "Details"}</Text>
        <TouchableOpacity style={styles.iconButton} onPress={toggleFavourite}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={24}
            color={isFav ? COLORS.error : COLORS.black}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `https://api.waslha.net/api/v1/files${product.image?.path}`,
            }}
            style={styles.productImage}
          />
        </View>

        {/* Product Information */}
        <View style={styles.productInfoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>
              {isRTL ? product.nameAr : product.nameEn}
            </Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating || "4.5"}</Text>
            </View>
          </View>

          <Text style={styles.price}>
            {getFirstVariantPrice(product.variants)} {t("EGP")}
          </Text>

          <View style={styles.divider} />

          {/* Product Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>
              {isRTL ? "تفاصيل المنتج" : "Product Details"}
            </Text>
            <Text style={styles.description}>
              {isRTL ? product.descriptionAr : product.descriptionEn}
            </Text>
          </View>

          {/* Related Products */}
          {relatedProducts?.data?.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>
                {isRTL ? "المنتجات ذات الصلة" : "Related Products"}
              </Text>
              <Carousel
                loop={false}
                width={width * 0.45}
                height={265}
                autoPlay={true}
                data={relatedProducts?.data}
                scrollAnimationDuration={1000}
                renderItem={renderItem}
                style={{ width: width }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>
            {isRTL ? "السعر الإجمالي" : "Total Price"}
          </Text>
          <Text style={styles.totalPrice}>
            {totalPrice} {t("EGP")}
          </Text>
        </View>

        {isAdded && isAuth ? (
          <View style={styles.actionsContainer}>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => {
                  if (quantity > 1) {
                    handleAddToCart(quantity - 1);
                  } else {
                    handleDeleteFromCart();
                  }
                }}
              >
                <AntDesign
                  name={quantity === 1 ? "delete" : "minus"}
                  size={20}
                  color={quantity === 1 ? COLORS.error : COLORS.black}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => handleAddToCart(quantity + 1)}
                disabled={
                  product?.variants &&
                  product.variants.length > 0 &&
                  quantity >= product.variants[0].stock
                }
              >
                <AntDesign name="plus" size={20} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.viewCartBtn}
              onPress={() => router.push("/(tabs)/cart")}
            >
              <Ionicons name="cart-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addToCartButton, isAdded && styles.addedButton]}
            onPress={() => handleAddToCart(quantity)}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color={COLORS.white}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.addToCartText}>
                  {isRTL ? "أضف إلى السلة" : "Add to Cart"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  imageContainer: {
    height: 300,
    width: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  productInfoContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    minHeight: 500,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productName: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
    flex: 1,
    textAlign: "left",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.black,
  },
  price: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "left",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEF0F2",
    marginVertical: 16,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 12,
    textAlign: "left",
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
    textAlign: "left",
  },
  relatedSection: {
    marginBottom: 20,
  },
  relatedListContent: {
    paddingVertical: 10,
    flexGrow: 0,
  },
  relatedProduct: {
    width: width * 0.43,
    marginRight: 12,
    marginHorizontal: 6,
    marginBottom: 10,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  priceContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
    textAlign: "left",
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "left",
  },
  addToCartButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
  },
  addedButton: {
    backgroundColor: COLORS.success,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "bold",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 6,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 18,
    fontFamily: "bold",
    marginHorizontal: 16,
    color: COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  viewCartBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductDetails;

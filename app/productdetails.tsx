import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "@/constants";
import { useLanguageContext } from "@/contexts/LanguageContext";
import ProductCard from "@/components/Product";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { useAddToCart, useCart } from "@/data/useCart";
import { useAddFavourite, useDeleteFavourite } from "@/data/useFavourites";
import { getStoredCartProductIds, getStoredFavouriteProductIds } from "@/data/useAppStatus";
import { useProduct, useProducts } from "@/data/useHome";
import { isAuthenticated } from "@/data/useAuth";
const { height, width } = Dimensions.get("window");

const renderItem = ({ item }: any) => {
  console.log(item,'item.image.path');
  
  return (
    <ProductCard
      style={styles.relatedProduct}
      name={item?.nameAr}
      image={`http://159.65.75.17:3000/api/v1/files${item?.image?.path}`}
                  // source={{ uri: `http://159.65.75.17:3000/api/v1/files${product.image?.path}` }}

      price={item?.price}
      productId={item?.id}
    />
  );
};


const ProductDetails = () => {
  const { t, isRTL } = useLanguageContext();
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAuth,setIsAuth]=useState(false)
  const [isFav, setIsFav] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const {data} =useCart()
  // Get product ID from route params
  const params = useLocalSearchParams();

  const productId = params.productId as string;

  // Fetch product data by ID
  const { data: product, isLoading: productLoading, error: productError } = useProduct(productId);
  // Fetch related products from the same category
  const { data: relatedProducts, isLoading, error } = useProducts(1, 10, product?.category?.id);
console.log(product,productId,"productproductproductproduct");

  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const { mutateAsync: addFav } = useAddFavourite();
  const { mutateAsync: delFav } = useDeleteFavourite();

  // Check initial cart and favourites status
  useEffect(() => {
    const checkStatus = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated)
      // console.log(authenticated,'authenticated');

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

  // Set quantity based on cart data
  useEffect(() => {
    if (data?.items && productId) {
      const cartItem = data.items.find((item: any) => item.productId === productId);
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
    return "0"; // fallback price
  };
useEffect(()=>{

})
  const handleAddToCart = async (qty:number) => {
    setQuantity(qty)
    try {
      // Check if user is authenticated
      if (!isAuth) {
        // Navigate to login screen
        router.push("/login");
        return;
      }

      const firstVariantId = Array.isArray(product?.variants) && product?.variants.length > 0 ? product?.variants[0]?.id : undefined;
      if (!productId || !firstVariantId) return;
      await addToCart({
        productId,
        variantId: firstVariantId,
        quantity: qty,
      });
      setIsAdded(true);
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
  const totalPrice = (parseFloat(getFirstVariantPrice(product?.variants)) * quantity).toFixed(2);

  // Show loading state while fetching product
  if (productLoading) {
    return (
      <SafeAreaView style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if product fetch failed
  if (productError || !product) {
    return (
      <SafeAreaView style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load product</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

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
          <TouchableOpacity style={styles.notificationButton} onPress={toggleFavourite}>
            <AntDesign name={isFav ? "heart" : "hearto"} size={20} color={isFav ? COLORS.primary : COLORS.primary} />
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
            source={{ uri: `http://159.65.75.17:3000/api/v1/files${product.image?.path}` }}
            style={styles.productImage}
          />
        </View>

        {/* Product Information */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName]}>
            {isRTL ? product.nameAr : product.nameEn}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={16}
                color={i < parseFloat(product.rating) ? "#FFD700" : "#DDD"}
              />
            ))}
          </View>

          {/* Price and Quantity */}
          <View style={styles.priceQuantityContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{getFirstVariantPrice(product.variants)} {t("EGP")}</Text>
              <Text style={styles.priceUnit}>
                {/* /{isRTL ? "كجم" : "KG"} */}
                </Text>
            </View>
{!isAuth &&!isAdded &&  <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton,styles.plusButton]}
                onPress={() => handleQuantityChange(false)}
                disabled={quantity==1}

              >
                <AntDesign name="minus" size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {quantity} 
                {/* {isRTL ? "كجم" : "KG"} */}
              </Text>
              <TouchableOpacity
                style={[styles.quantityButton, styles.plusButton]}
                onPress={() => handleQuantityChange(true)}
              >
                <AntDesign name="plus" size={16} color="#fff" />
              </TouchableOpacity>
            </View>}
           
          </View>

          {/* Product Details */}
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle]}>
              {isRTL ? "تفاصيل المنتج" : "Product Details"}
            </Text>
            <Text style={[styles.description]}>
              {isRTL ? product.descriptionAr : product.descriptionEn}
                         

            </Text>
          </View>

          {/* Related Products */}
          <View style={styles.relatedSection}>
            <Text style={[styles.sectionTitle]}>
              {isRTL ? "المنتجات ذات الصلة" : "Related Products"}
            </Text>
            <View style={{ direction: "ltr" }}>
              <FlatList
                horizontal
                data={relatedProducts?.data}
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
          <Text style={styles.totalPrice}>{totalPrice}</Text>
        </View>
        {isAdded  && isAuth?
         <View style={styles.quantityContainer}>
         <TouchableOpacity
           style={[styles.quantityButton,styles.plusButton]}
           onPress={() => handleAddToCart(quantity-1)}
           disabled={quantity==1}

         >
           <AntDesign name="minus" size={16} color="#fff" />
         </TouchableOpacity>
         <Text style={styles.quantityText}>
           {quantity} 
           {/* {isRTL ? "كجم" : "KG"} */}
         </Text>
         <TouchableOpacity
           style={[styles.quantityButton, styles.plusButton]}
           onPress={() => handleAddToCart(quantity+1)}
         >
           <AntDesign name="plus" size={16} color="#fff" />
         </TouchableOpacity>
       </View>
       :  <TouchableOpacity 
       style={[styles.addToCartButton, isAdded && styles.addedToCartButton]} 
       onPress={()=>handleAddToCart(quantity)}
       disabled={isPending || isAdded}
     >
       {isPending ? (
         <ActivityIndicator size="small" color={COLORS.white} />
       ) : (
         <Text style={styles.addToCartText}>
           {isAdded 
             ? (isRTL ? "تمت الإضافة" : "Added to Cart") 
             : (isRTL ? "أضف إلى السلة" : "Add to Cart")
           }
         </Text>
       )}
     </TouchableOpacity>
        }
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
    backgroundColor: COLORS.white,
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
    height: 200,
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.white,
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
    paddingTop:20
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
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grayscale700,
    marginBottom: 4,
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
  addedToCartButton: {
    backgroundColor: COLORS.success,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.red,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetails;

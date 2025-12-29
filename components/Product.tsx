import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useAddToCart, useUpdateCartItem, useDeleteCartItem } from "@/data/useCart";
import { useAddFavourite, useDeleteFavourite } from "@/data/useFavourites";
import {
  getStoredCartProductIds,
  getStoredFavouriteProductIds,
} from "@/data/useAppStatus";
import { useAuthStatus } from "@/data";

const ProductCard = ({
  name,
  image,
  price,
  rating,
  style,
  varints,
  productId,
  cartItem,
}: any) => {
  const router = useRouter();
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const { mutateAsync: updateCartItem } = useUpdateCartItem();
  const { mutateAsync: deleteCartItem } = useDeleteCartItem();
  const [isAdded, setIsAdded] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [cartItemId, setCartItemId] = useState<string | null>(null);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: authStatus, isLoading, refetch } = useAuthStatus();

  const { mutateAsync: addFav } = useAddFavourite();
  const { mutateAsync: delFav } = useDeleteFavourite();
  // console.log(cartItem?.quantity, "aaaaaaaacartItemcartItemcartItemmmmmmm");

  // Check initial cart and favourites status
  useEffect(() => {
    const checkStatus = async () => {
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

  // Update cart quantity from cartItem prop
  useEffect(() => {
    if (cartItem) {
      setCartItemId(cartItem.id);
      setIsAdded(true);
    } else {
      setCartItemId(null);
      setIsAdded(false);
    }
  }, [cartItem]);

  // console.log(varints, "varints");
  const getFirstVariantPrice = (variants: any) => {
    if (Array.isArray(variants) && variants.length > 0 && variants[0].price) {
      return variants[0].price;
    }
    return price; // fallback to main price prop
  };

  const handleProductPress = () => {
    router.push({
      pathname: "/productdetails",
      params: {
        productId,
      },
    });
  };

  const handleAddToCart = async () => {
    try {
      const firstVariantId =
        Array.isArray(varints) && varints.length > 0
          ? varints[0]?.id
          : undefined;
      if (!productId || !firstVariantId) return;
      
      await addToCart({
        productId,
        variantId: firstVariantId,
        quantity: 1,
      });
      
      setIsAdded(true);
    } catch (error: any) {
      // console.log(error);
      if (error?.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  const handleIncreaseQuantity = async () => {
    if (!cartItemId) return;
    setIsIncreasing(true);
    try {
      const newQuantity = cartItem?.quantity + 1;
      await updateCartItem({
        itemId: cartItemId,
        quantity: newQuantity,
      });
    } catch (error) {
      // console.log(error);
    } finally {
      setIsIncreasing(false);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (!cartItemId || cartItem?.quantity <= 1) return;
    setIsDecreasing(true);
    try {
      const newQuantity = cartItem?.quantity - 1;
      await updateCartItem({
        itemId: cartItemId,
        quantity: newQuantity,
      });
    } catch (error) {
      // console.log(error);
    } finally {
      setIsDecreasing(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!cartItemId) return;
    setIsDeleting(true);
    try {
      await deleteCartItem(cartItemId);
      setIsAdded(false);
      setCartItemId(null);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFavourite = async () => {
    if (!productId) return;
    try {
      if (isFav) {
        await delFav(productId);
        setIsFav(false);
      } else {
        // console.log(productId,'productIdddddd');

        await addFav({ productId });
        setIsFav(true);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={
          authStatus?.isAuthenticated
            ? () => toggleFavourite()
            : () => router.push("/login")
        }
      >
        <AntDesign
          name={isFav ? "heart" : "hearto"}
          size={22}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleProductPress}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={{width: "100%"}} onPress={handleProductPress}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {name}
        </Text>
      </TouchableOpacity>

      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesome
            key={i}
            name="star"
            size={14}
            color={i + 1 < rating ? "#FFA500" : "#DDD"}
          />
        ))}
      </View>

      <Text style={styles.price}>{getFirstVariantPrice(varints)} ج.م</Text>

      {/* Add to Cart Button or Cart Controls */}
      {!isAdded ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={
            authStatus?.isAuthenticated
              ? handleAddToCart
              : () => router.push("/login")
          }
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <AntDesign name="plus" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.cartControls}>
          <TouchableOpacity
            style={[styles.controlButton]}
            onPress={handleIncreaseQuantity}
            disabled={isIncreasing}
          >
            {isIncreasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <AntDesign name="plus" size={16} color="#fff" />
            )}
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{cartItem?.quantity}</Text>
          
          <TouchableOpacity
            style={[styles.controlButton,{backgroundColor: cartItem?.quantity <= 1 ? COLORS.paleGreenDark : COLORS.primary}]}
            onPress={handleDecreaseQuantity}
            disabled={cartItem?.quantity <= 1 || isDecreasing}
          >
            {isDecreasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <AntDesign name="minus" size={16} color="#fff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleRemoveFromCart}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="delete" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "45%",
    height: 250,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingBottom: 10,
    paddingTop: 5,

    paddingHorizontal: 5,
    margin: 5,
    alignItems: "center",
    position: "relative",
    // elevation: 2,
    direction: "rtl",
    borderWidth: 1,
    borderColor: COLORS.paleGreenDark,
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    end: 12,
    zIndex: 222222,
  },
  imageContainer: {
    backgroundColor: COLORS.paleGreen,
    // height: "50%",
    borderRadius: 16,

    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginVertical: 5,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
  placeholderText: {
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 0,
    marginTop: 10,
    // width: "100%",
    // paddingRight: 5,
    color: COLORS.black,
    width: "100%",
    //  backgroundColor:"red",
    // textAlign:"left"
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: 6,
    width: "100%",
    paddingRight: 5,
    // display: "none",
  },
  price: {
    color: COLORS.primary,
    fontWeight: "bold",
    width: "100%",
    paddingRight: 5,
    marginBottom: 6,
    fontSize: 16,
   
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 12,
    padding: 8,
    width: "100%",
    gap: 8,
  },
  controlButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    minWidth: 30,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductCard;

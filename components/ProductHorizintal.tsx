import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useUpdateCartItem, useDeleteCartItem } from "@/data/useCart";
import { useDeleteFavourite } from "@/data/useFavourites";

const ProductCardHorizintal = ({
  name,
  image,
  price,
  rating,
  style,
  icon,
  description,
  iconColor,
  itemId,
  quantity,
  onQuantityChange,
  productId,
}: any) => {
  const router = useRouter();
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);
  
  const { mutateAsync: updateCartItem } = useUpdateCartItem();
  const { mutateAsync: deleteCartItem, isPending: isDeleting } = useDeleteCartItem();
  const { mutateAsync: deleteFavourite, isPending: isDeletingFav } = useDeleteFavourite();

  const isFavouritesMode = icon === "heart";

  const handleProductPress = () => {
    router.push({
      pathname: "/productdetails",
      params: {
        productId,
      },
    });
  };

  const handleQuantityChange = async (increment: boolean) => {
    if (!itemId) return;

    const newQuantity = increment ? quantity + 1 : Math.max(1, quantity - 1);

    if (increment) {
      setIsIncreasing(true);
    } else {
      setIsDecreasing(true);
    }

    try {
      await updateCartItem({
        itemId,
        quantity: newQuantity,
      });
      if (onQuantityChange) {
        onQuantityChange(newQuantity);
      }
    } catch (error) {
      // console.log("Failed to update quantity:", error);
    } finally {
      setIsIncreasing(false);
      setIsDecreasing(false);
    }
  };

  const handleDelete = async () => {
    if (!itemId) return;

    try {
      await deleteCartItem(itemId);
    } catch (error) {
      // console.log("Failed to delete item:", error);
    }
  };

  const handleDeleteFavourite = async () => {
    if (!productId) return;

    try {
      await deleteFavourite(productId);
    } catch (error) {
      // console.log("Failed to delete favourite:", error);
    }
  };

  return (
    <View style={[styles.card, style]}>
      {/* Image Container (First Child = Right in RTL) */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleProductPress}
        activeOpacity={0.7}
      >
        <Image source={image} style={styles.image} />
      </TouchableOpacity>

      {/* Content Container (Second Child = Left in RTL) */}
      <View style={styles.contentContainer}>
        <View>
          {/* Name */}
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>

          {/* Description */}
          <Text
            style={styles.descriptions}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {description}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={12}
                color={i < rating ? "#FFA500" : "#E0E0E0"}
                style={{ marginLeft: 2 }}
              />
            ))}
          </View>
        </View>

        {/* Bottom Row: Price (Right) & Actions (Left) */}
        <View style={styles.bottomRow}>
          {/* Price (First Child = Right in RTL) */}
          <Text style={styles.price}>{price} ج.م</Text>

          {/* Actions (Second Child = Left in RTL) */}
          {isFavouritesMode ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeleteFavourite}
              disabled={isDeletingFav}
              activeOpacity={0.8}
            >
              {isDeletingFav ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="delete" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  (quantity <= 1 || isDecreasing) && styles.disabledButton,
                ]}
                onPress={() => handleQuantityChange(false)}
                disabled={isDecreasing || isIncreasing || quantity <= 1}
                activeOpacity={0.7}
              >
                {isDecreasing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <AntDesign name="minus" size={14} color="#fff" />
                )}
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  isIncreasing && styles.disabledButton,
                ]}
                onPress={() => handleQuantityChange(true)}
                disabled={isIncreasing || isDecreasing}
                activeOpacity={0.7}
              >
                {isIncreasing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <AntDesign name="plus" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Absolute Delete Button for Cart Mode (Top Left) */}
      {!isFavouritesMode && (
        <TouchableOpacity
          style={styles.deleteCartButton}
          onPress={handleDelete}
          disabled={isDeleting}
          activeOpacity={0.8}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="delete" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 145,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    position: "relative",
  },
  imageContainer: {
    width: 110,
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.paleGreen,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  contentContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginStart: 12,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
    color: COLORS.black,
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 4,
    writingDirection: "rtl",
    fontFamily: "semibold",
  },
  descriptions: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "left",
    marginBottom: 6,
    lineHeight: 16,
    writingDirection: "rtl",
    fontFamily: "regular",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  price: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 17,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
    fontFamily: "bold",
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 50,
  },
  deleteCartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
});

export default ProductCardHorizintal;

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
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
  const { mutateAsync: updateCartItem, isPending: isUpdating } =
    useUpdateCartItem();
  const { mutateAsync: deleteCartItem, isPending: isDeleting } =
    useDeleteCartItem();
  const { mutateAsync: deleteFavourite, isPending: isDeletingFav } =
    useDeleteFavourite();

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

    try {
      await updateCartItem({
        itemId,
        quantity: newQuantity,
      });
      if (onQuantityChange) {
        onQuantityChange(newQuantity);
      }
    } catch (error) {
      console.log("Failed to update quantity:", error);
    }
  };

  const handleDelete = async () => {
    if (!itemId) return;

    try {
      await deleteCartItem(itemId);
    } catch (error) {
      console.log("Failed to delete item:", error);
    }
  };

  const handleDeleteFavourite = async () => {
    if (!productId) return;

    try {
      await deleteFavourite(productId);
    } catch (error) {
      console.log("Failed to delete favourite:", error);
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
              <AntDesign name="delete" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.disabledButton,
                ]}
                onPress={() => handleQuantityChange(false)}
                disabled={isUpdating || quantity <= 1}
                activeOpacity={0.7}
              >
                <AntDesign name="minus" size={14} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(true)}
                disabled={isUpdating}
                activeOpacity={0.7}
              >
                <AntDesign name="plus" size={14} color="#fff" />
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
          <AntDesign name="delete" size={16} color="#fff" />
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
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginStart: 12, // Adds space between Image and Content
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
    color: COLORS.black,
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 4,
    writingDirection: "rtl",
  },
  descriptions: {
    fontSize: 12,
    color: COLORS.gray3,
    textAlign: "left",
    marginBottom: 6,
    lineHeight: 16,
    writingDirection: "rtl",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Start = Right in RTL
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
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteCartButton: {
    position: "absolute",
    top: 8,
    right: 8, // Left side (opposite to image in RTL)
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 50,
    shadowColor: "#ff4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
});

export default ProductCardHorizintal;

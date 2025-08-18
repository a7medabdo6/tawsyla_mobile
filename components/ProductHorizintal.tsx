import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons"; // You can also use other icon libraries
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
	iconColor,
	itemId,
	quantity,
	onQuantityChange,
	productId,
}: any) => {
	const router = useRouter();
	const { mutateAsync: updateCartItem, isPending: isUpdating } = useUpdateCartItem();
	const { mutateAsync: deleteCartItem, isPending: isDeleting } = useDeleteCartItem();
	const { mutateAsync: deleteFavourite, isPending: isDeletingFav } = useDeleteFavourite();

	const isFavouritesMode = icon === "heart";

	const handleProductPress = () => {
		router.push("/productdetails");
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
			<TouchableOpacity
				style={styles.imageContainer}
				onPress={handleProductPress}
			>
				<Image source={image} style={styles.image} />
			</TouchableOpacity>
			<View
				style={{
					display: "flex",
					justifyContent: "space-between",

					width: "60%",
					marginTop: 10,
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						width: "100%",
						// backgroundColor: "red",
						alignItems: "center",
					}}
				>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.price}>${price}/KG</Text>
				</View>
				<Text style={styles.descriptions}>
					descriptions descriptions descriptions descriptions descriptions
					descriptions descriptions
				</Text>

				<View style={styles.ratingContainer}>
					{Array.from({ length: 5 }).map((_, i) => (
						<FontAwesome
							key={i}
							name="star"
							size={14}
							color={i < rating ? "#FFA500" : "#DDD"}
						/>
					))}
				</View>
			</View>
{!isFavouritesMode && <TouchableOpacity
					style={styles.deleteCartButton}
					onPress={handleDelete}
					disabled={isDeletingFav}
				>
					<AntDesign name="delete" size={18} color="#fff" />
				</TouchableOpacity>}
			{isFavouritesMode ? (
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={handleDeleteFavourite}
					disabled={isDeletingFav}
				>
					<AntDesign name="delete" size={18} color="#fff" />
				</TouchableOpacity>
			) : (
				<View style={styles.quantityContainer}>
					<TouchableOpacity
						style={[styles.quantityButton, styles.minusButton]}
						onPress={() => handleQuantityChange(false)}
						disabled={isUpdating || quantity <= 1}
					>
						<AntDesign name="minus" size={16} color="#fff" />
					</TouchableOpacity>
					
					<Text style={styles.quantityText}>{quantity}</Text>
					
					<TouchableOpacity
						style={[styles.quantityButton, styles.plusButton]}
						onPress={() => handleQuantityChange(true)}
						disabled={isUpdating}
					>
						<AntDesign name="plus" size={16} color="#fff" />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		width: "95%",
		height: 120,
		backgroundColor: COLORS.white,
		borderRadius: 16,
		paddingBottom: 10,
		paddingTop: 5,

		paddingHorizontal: 5,
		margin: 5,
		position: "relative",
		direction: "rtl",
		display: "flex",
		flexDirection: "row",
		alignItems: "flex-start",
	},
	heartIcon: {
		position: "absolute",
		top: 12,
		left: 12,
	},
	imageContainer: {
		backgroundColor: COLORS.paleGreen,
		// height: "50%",
		borderRadius: 16,

		// flex: 1,
		width: "40%",
		// display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	image: {
		width: 70,
		height: 70,
		resizeMode: "contain",
		marginVertical: 10,
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
		// marginBottom: 4,
		// width: "100%",
		paddingRight: 5,
		color: COLORS.black,
	},
	ratingContainer: {
		flexDirection: "row",
		marginVertical: 6,
		width: "100%",
		paddingRight: 5,
	},
	price: {
		color: "#4CAF50",
		fontWeight: "bold",
		fontSize: 16,

		// marginBottom: 10,
		// width: "100%",
		// paddingRight: 5,
	},
	descriptions: {
		fontSize: 12,
		color: COLORS.gray3,
		paddingRight: 5,
	},
	quantityContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#4CAF50",
		borderTopRightRadius: 6,
		borderBottomLeftRadius: 16,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	quantityButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	minusButton: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	plusButton: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	quantityText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
		marginHorizontal: 8,
		minWidth: 20,
		textAlign: "center",
	},
	deleteButton: {
		position: "absolute",
		bottom: 0,
		left: 0,
		backgroundColor: "#ff4444",
		padding: 8,
		borderTopRightRadius: 6,
		borderBottomLeftRadius: 16,
	},
	deleteCartButton:{
		position: "absolute",
		top: 10,
		right: 10,
		backgroundColor: "#ff4444",
		padding: 8,
		borderRadius: 50,
	}
});

export default ProductCardHorizintal;

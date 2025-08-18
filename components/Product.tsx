import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons"; // You can also use other icon libraries
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useAddToCart } from "@/data/useCart";
import { useAddFavourite, useDeleteFavourite } from "@/data/useFavourites";
import { getStoredCartProductIds, getStoredFavouriteProductIds } from "@/data/useAppStatus";

const ProductCard = ({ name, image, price, rating, style, varints, productId }: any) => {
	const router = useRouter();
	const { mutateAsync: addToCart, isPending } = useAddToCart();
	const [isAdded, setIsAdded] = useState(false);
	const [isFav, setIsFav] = useState(false);
	const { mutateAsync: addFav } = useAddFavourite();
	const { mutateAsync: delFav } = useDeleteFavourite();

	// Check initial cart and favourites status
	useEffect(() => {
		const checkStatus = async () => {
			if (productId) {
				const [cartIds, favIds] = await Promise.all([
					getStoredCartProductIds(),
					getStoredFavouriteProductIds(),
				]);
console.log(cartIds,'cartIds');

				setIsAdded(cartIds.includes(productId));
				setIsFav(favIds.includes(productId));
			}
		};
		checkStatus();
    
	}, [productId]);

	// console.log(varints, "varints");
	const getFirstVariantPrice = (variants: any) => {
		if (Array.isArray(variants) && variants.length > 0 && variants[0].price) {
			return variants[0].price;
		}
		return price; // fallback to main price prop
	};

	const handleProductPress = () => {
		router.push("/productdetails");
	};

	const handleAddToCart = async () => {
		try {
			const firstVariantId = Array.isArray(varints) && varints.length > 0 ? varints[0]?.id : undefined;
			if (!productId || !firstVariantId) return;
			await addToCart({
				productId,
				variantId: firstVariantId,
				quantity: 1,
			});
			setIsAdded(true);
		} catch (error) {
			console.log(error);
			
			// Optionally handle error (toast/log)
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
			console.log(error);
		}
	};

	return (
		<View style={[styles.card, style]}>
			<TouchableOpacity style={styles.heartIcon} onPress={toggleFavourite}>
				<AntDesign name={isFav ? "heart" : "hearto"} size={22} color="#4CAF50" />
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.imageContainer}
				 onPress={handleProductPress}
			>
				<Image source={{ uri: image }} style={styles.image} />
			</TouchableOpacity>

			<TouchableOpacity onPress={handleProductPress}>
				<Text style={styles.name}>{name}</Text>
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
			<TouchableOpacity style={styles.addButton} onPress={handleAddToCart} disabled={isPending || isAdded}>
				<AntDesign name={isAdded ? "check" : "plus"} size={18} color="#fff" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		width: "45%",
		height: 220,
		backgroundColor: COLORS.white,
		borderRadius: 16,
		paddingBottom: 10,
		paddingTop: 5,

		paddingHorizontal: 5,
		margin: 9,
		alignItems: "center",
		position: "relative",
		// elevation: 2,
		direction: "rtl",
	},
	heartIcon: {
		position: "absolute",
		top: 12,
		left: 12,
		zIndex:222222
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
		width: 70,
		height: 70,
		resizeMode: "contain",
		marginVertical: 10,
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 4,
		width: "100%",
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
		// marginBottom: 10,
		width: "100%",
		paddingRight: 5,
	},
	addButton: {
		backgroundColor: "#4CAF50",
		padding: 8,
		position: "absolute",
		bottom: 0,
		left: 0,
		// borderRadius: 16,
		borderTopRightRadius: 6,
		borderBottomLeftRadius: 16,
	},
});

export default ProductCard;

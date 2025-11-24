import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCart } from "./useCart";
import { fetchFavourites } from "./useFavourites";

export const useAppStatus = () => {
	return useQuery({
		queryKey: ["appStatus"],
		queryFn: async () => {
			try {
				// Fetch cart and favourites in parallel
				const [cartResponse, favouritesResponse] = await Promise.all([
					fetchCart(),
					fetchFavourites(),
				]);

				// Extract cart item IDs
				const cartItems = cartResponse?.items || [];
				const cartProductIds = cartItems.map((item: any) => item.productId);

				// Extract favourite product IDs
				const favouritesItems = favouritesResponse?.items || favouritesResponse?.data || favouritesResponse || [];
			// console.log(favouritesItems,'favouritesItemssssss');
				const favouriteProductIds =favouritesItems?.length>0 && favouritesItems?.map((item: any) => 
					item.productId || item.product?.id || item.id
				);

				// Save to AsyncStorage
				await AsyncStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
				await AsyncStorage.setItem('favouriteProductIds', JSON.stringify(favouriteProductIds));

				return {
					cartProductIds,
					favouriteProductIds,
					cartItems,
					favouritesItems,
				};
			} catch (error) {
				console.log("Error fetching app status:", error);
				// Return empty arrays if API calls fail
				return {
					cartProductIds: [],
					favouriteProductIds: [],
					cartItems: [],
					favouritesItems: [],
				};
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Utility functions to get stored IDs
export const getStoredCartProductIds = async (): Promise<string[]> => {
	try {
		const ids = await AsyncStorage.getItem('cartProductIds');
		return ids ? JSON.parse(ids) : [];
	} catch (error) {
		console.log("Error getting stored cart IDs:", error);
		return [];
	}
};

export const getStoredFavouriteProductIds = async (): Promise<string[]> => {
	try {
		const ids = await AsyncStorage.getItem('favouriteProductIds');
		// console.log(ids,'idsids');
		
		return ids ? JSON.parse(ids) : [];
	} catch (error) {
		console.log("Error getting stored favourite IDs:", error);
		return [];
	}
};

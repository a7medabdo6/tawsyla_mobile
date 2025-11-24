import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./instance";



export const addAddress = async (payload: any) => {
	try {
		const response = await api.post("addresses", payload);
		return response.data;
	} catch (error:any) {
		console.log(error?.response?.data);
		throw error;
	}
};

export const useAddAddress = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addAddress,
		onSuccess: async (data, variables) => {
			// Invalidate any cart-related queries if they exist
			queryClient.invalidateQueries({ queryKey: ["address"] });
			
			// Update AsyncStorage
			try {
				const existingIds = await AsyncStorage.getItem('cartProductIds');
				const cartIds = existingIds ? JSON.parse(existingIds) : [];
				if (!cartIds.includes(variables.productId)) {
					cartIds.push(variables.productId);
					await AsyncStorage.setItem('cartProductIds', JSON.stringify(cartIds));
				}
			} catch (error) {
				console.log("Error updating cart AsyncStorage:", error);
			}
		},
	});
};

export const fetchAddress = async () => {
	const response = await api.get("addresses");
	return response.data;
};

export const useAddress = () => {
	return useQuery<any>({
		queryKey: ["address"],
		queryFn: fetchAddress,
	});
};



export const useGetOneAddress  = (id: string) => {
	return useQuery({
		queryKey: ["oneaddress", id],
		queryFn: async () => {
			const response = await api.get(`addresses/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
};




export const updateAddress = async (payload: any) => {
	try {
		const response = await api.put(`addresses/${payload.id}`, payload);
		return response.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useUpdateAddress = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateAddress,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["address"] });
		},
	});
};

export const deleteCartItem = async (itemId: string) => {
	try {
		const response = await api.delete(`cart/items/${itemId}`);
		return response.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useDeleteCartItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteCartItem,
		onSuccess: async (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			queryClient.invalidateQueries({ queryKey: ["appStatus"] });
			
			// Note: We can't easily remove from AsyncStorage here since we don't have productId
			// The appStatus query will refresh and update AsyncStorage on next load
		},
	});
};



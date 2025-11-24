import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./instance";

export interface AddToCartPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

export const addToCart = async (payload: AddToCartPayload) => {
  try {
    const response = await api.post("cart/items", payload);
    return response.data;
  } catch (error: any) {
    console.log(error?.response?.data);
    throw error;
  }
};

export const useAddToCart = () => {
  //   console.log("useAddToCart");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: async (data, variables) => {
      // Invalidate any cart-related queries if they exist
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["appStatus"] });

      // Update AsyncStorage
      try {
        const existingIds = await AsyncStorage.getItem("cartProductIds");
        const cartIds = existingIds ? JSON.parse(existingIds) : [];
        if (!cartIds.includes(variables.productId)) {
          cartIds.push(variables.productId);
          await AsyncStorage.setItem("cartProductIds", JSON.stringify(cartIds));
        }
      } catch (error) {
        console.log("Error updating cart AsyncStorage:", error);
      }
    },
  });
};

export const fetchCart = async () => {
  try {
    const response = await api.get("cart");
    return response.data;
  } catch (error: any) {
    // console.log(error?.response?.data);

    return error?.response?.data;
  }
};

export const useCart = () => {
  return useQuery<any>({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });
};

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

export const updateCartItem = async (payload: UpdateCartItemPayload) => {
  try {
    const response = await api.put(`cart/items/${payload.itemId}`, {
      quantity: payload.quantity,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["appStatus"] });
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

export const validateCoupon = async (payload: any) => {
  try {
    const response = await api.post(`v1/coupons/validate`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: validateCoupon,
    onSuccess: async (data, variables) => {
      return data;
      // Note: We can't easily remove from AsyncStorage here since we don't have productId
      // The appStatus query will refresh and update AsyncStorage on next load
    },
  });
};

export const confirmOrder = async (payload: any) => {
  try {
    const response = await api.post(`v1/orders`, payload);
    return response.data;
  } catch (error: any) {
    console.log(error?.response?.data);
    throw error?.response?.data;
  }
};
export const useConfirmOrder = () => {
  return useMutation({
    mutationFn: confirmOrder,
    onSuccess: async (data, variables) => {
      return data;
      // Note: We can't easily remove from AsyncStorage here since we don't have productId
      // The appStatus query will refresh and update AsyncStorage on next load
    },
  });
};

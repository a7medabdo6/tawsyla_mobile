import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./instance";

export interface AddFavouritePayload {
  productId: string;
}

export const fetchFavourites = async () => {
  try {
    const response = await api.get("favourites");
    return response.data;
  } catch (error: any) {
    // console.log(error?.response?.data);

    return error?.response?.data;
  }
};

export const addFavourite = async (payload: AddFavouritePayload) => {
  try {
    const response = await api.post("favourites", payload);
    return response.data;
  } catch (error: any) {
    // console.log(error?.response?.data, "errrr");
  }
};

export const deleteFavourite = async (productId: string) => {
  // Assuming DELETE by productId path
  const response = await api.delete(`favourites/${productId}`);
  return response.data;
};

export const useFavourites = () => {
  return useQuery<any>({
    queryKey: ["favourites"],
    queryFn: fetchFavourites,
  });
};

export const useAddFavourite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFavourite,
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["appStatus"] });

      // Update AsyncStorage
      try {
        const existingIds = await AsyncStorage.getItem("favouriteProductIds");
        const favIds = existingIds ? JSON.parse(existingIds) : [];
        if (!favIds.includes(variables.productId)) {
          favIds.push(variables.productId);
          await AsyncStorage.setItem(
            "favouriteProductIds",
            JSON.stringify(favIds)
          );
        }
      } catch (error) {
        // console.log("Error updating favourites AsyncStorage:", error);
      }
    },
  });
};

export const useDeleteFavourite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFavourite,
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["appStatus"] });

      // Update AsyncStorage
      try {
        const existingIds = await AsyncStorage.getItem("favouriteProductIds");
        const favIds = existingIds ? JSON.parse(existingIds) : [];
        const updatedIds = favIds.filter((id: string) => id !== variables);
        await AsyncStorage.setItem(
          "favouriteProductIds",
          JSON.stringify(updatedIds)
        );
      } catch (error) {
        // console.log("Error updating favourites AsyncStorage:", error);
      }
    },
  });
};

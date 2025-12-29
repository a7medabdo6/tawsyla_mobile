import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./instance";


export const fetchSettings = async () => {
  try {
    const response = await api.get("v1/settings/public");
    return response.data;
  } catch (error: any) {
    // console.log(error?.response?.data);

    return error?.response?.data;
  }
};

export const useSettings = () => {
  return useQuery<any>({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });
};



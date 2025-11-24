import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "./instance";

export const fetchOrders = async () => {
  try {
    const response = await api.get("v1/orders/my-orders");
    return response.data;
  } catch (error: any) {
    // console.log(error?.response?.data);

    return error?.response?.data;
  }
};

export const useOrders = () => {
  return useQuery<any>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};
export const useOrdersInfinite = (limit = 5) => {
  return useInfiniteQuery({
    queryKey: ["orders-infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      let url = `v1/orders/my-orders?page=${pageParam}&limit=${limit}`;

      const response = await api.get(url);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // console.log(lastPage, "lastPagelastPage");

      // Check if there are more pages based on the API response structure
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useOneOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["oneOrder", orderId],
    queryFn: async () => {
      const response = await api.get(`v1/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
};
export const useOrderHistory = (orderId: string) => {
  return useQuery({
    queryKey: ["OrderHistory", orderId],
    queryFn: async () => {
      const response = await api.get(`v1/orders/${orderId}/status-history`);
      return response.data;
    },
    enabled: !!orderId,
  });
};

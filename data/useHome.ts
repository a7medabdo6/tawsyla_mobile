// src/api/userApi.js
import { useQuery } from "@tanstack/react-query";
import api from "./instance";

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const fetchProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};
export const useCategories = () => {
  return useQuery<any>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

export const useProducts = () => {
  return useQuery<any>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

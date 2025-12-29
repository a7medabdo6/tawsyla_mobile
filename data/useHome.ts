// src/api/userApi.js
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "./instance";

export const useProducts = (page = 1, limit = 5, categoryId = '') => {
	return useQuery({
		queryKey: ["products", page, limit, categoryId],
		queryFn: async () => {
			let url = `/products?page=${page}&limit=${limit}`;
			if (categoryId) {
				url += `&filter=category.id||$eq||${categoryId}`;
			}
			const response = await api.get(url);
			return response.data;
		},
	});
};

export const useProductsInfinite = (
	limit = 10,
	search = "",
	categoryId = "",
	priceRange = { min: "", max: "" },
	rating: number | null = null,
	sortBy = ""
) => {
	return useInfiniteQuery({
		queryKey: ["products-infinite", search, categoryId, priceRange, rating, sortBy],
		queryFn: async ({ pageParam = 1 }) => {
			let url = `/products?page=${pageParam}&limit=${limit}`;

			// Build search object with all filters
			const searchConditions: any[] = [];

			var filterConditions: any = "";

			// Search filter for nameAr
			if (search) {
				searchConditions.push({
					nameAr: { $cont: search }
				});
			}

			// Rating filter - greater than or equal to selected rating
			if (rating) {
				searchConditions.push({
					rating: { $gte: rating.toString() }
				});
			}

			// Category filter - nested category relation
			if (categoryId) {
				filterConditions += `filter=category.id||$eq||${categoryId}`

			}

			// Price range filter - nested variants relation
			if (priceRange.min || priceRange.max) {

				filterConditions += `&filter=variants.price||$between||${priceRange.min},${priceRange.max}`

			}

			if (searchConditions.length > 0) {
				const searchObject = searchConditions.length === 1 ? searchConditions[0] : { $and: searchConditions };
				url += `&s=${encodeURIComponent(JSON.stringify(searchObject))}`;
			}
			if (filterConditions) {
				url += `&${filterConditions}`;

			}

			// Sort filter
			if (sortBy) {
				url += `&sort=${sortBy}`;
			}
			// console.log(url,"urlurl");

			const response = await api.get(url);
			return response.data;
		},
		getNextPageParam: (lastPage, allPages) => {
			// Check if there are more pages based on the API response structure
			if (lastPage.page < lastPage.pageCount) {
				return lastPage.page + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
	});
};

export const useMasterCategories = () => {
	return useQuery({
		queryKey: ["master-categories"],
		queryFn: async () => {
			const response = await api.get(`/master-categories`);
			return response.data;
		},
	});
};
export const useCategories = ({ masterId = "", limit = 100 }: any) => {
	return useQuery({
		queryKey: ["categories", masterId],
		queryFn: async () => {
			const response = masterId ? await api.get(`/categories?filter=masterCategoryId||$eq||${masterId}&limit=${limit}`) : await api.get(`/categories?limit=${limit}`);
			return response.data;
		},
	});
};
export const useBanners = () => {
	return useQuery({
		queryKey: ["banners"],
		queryFn: async () => {
			const response = await api.get("/banners");
			return response.data;
		},
	});
};

export const useProduct = (productId: string) => {

	return useQuery({
		queryKey: ["product", productId],
		queryFn: async () => {
			const response = await api.get(`/products/${productId}`);
			// console.log(response.data, "response.dataresponse.data");
			return response.data;
		},
		// enabled: !!productId,
	});
};

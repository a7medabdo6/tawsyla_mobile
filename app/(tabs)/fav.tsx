import {
	View,
	Text,
	TouchableOpacity,
	Image,
	useWindowDimensions,
	StatusBar,
	ImageSourcePropType,
	StyleSheet,
	FlatList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, icons, images, SIZES } from "@/constants";
import { FromMeRoute, ToMeRoute } from "@/tabs";
import ProductCardHorizintal from "@/components/ProductHorizintal";
import { useFavourites } from "@/data/useFavourites";
import { useFocusEffect } from "expo-router";
const orange = require("../../assets/images/orange.png");

const renderScene = SceneMap({
	first: FromMeRoute,
	second: ToMeRoute,
});

const Fav = () => {
	const layout = useWindowDimensions();

	const [index, setIndex] = React.useState(0);

	const [routes] = React.useState([
		{ key: "first", title: "From Me" },
		{ key: "second", title: "To Me" },
	]);

	const { data, isLoading, error,refetch } = useFavourites();
	const items = data?.items || data?.data || data || [];
	useFocusEffect(
		React.useCallback(() => {
		  refetch();
		}, [refetch])
	  );
	
	const renderTabBar = (props: any) => (
		<TabBar
			{...props}
			indicatorStyle={{
				backgroundColor: COLORS.primary,
			}}
			style={{
				backgroundColor: COLORS.white,
			}}
			renderLabel={({ route, focused }) => (
				<Text
					style={[
						{
							color: focused ? COLORS.primary : "gray",
							fontSize: 16,
							fontFamily: "bold",
						},
					]}
				>
					{route.title}
				</Text>
			)}
		/>
	);

	/**
	 * render header
	 */
	const renderHeader = () => {
		return (
			<View style={styles.headerContainer}>
				<View style={styles.headerLeft}>
					<Image
						source={images.logo as ImageSourcePropType}
						resizeMode="contain"
						style={styles.headerLogo}
					/>
					<Text
						style={[
							styles.headerTitle,
							{
								color: COLORS.greyscale900,
							},
						]}
					>
						المفضلة
					</Text>
				</View>
				<View style={styles.headerRight}>
					<TouchableOpacity>
						<Image
							source={icons.moreCircle as ImageSourcePropType}
							resizeMode="contain"
							style={[
								styles.moreCircleIcon,
								{
									tintColor: COLORS.greyscale900,
								},
							]}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: COLORS.white, direction: "rtl" }}
		>
			<StatusBar hidden={true} />
			<View style={{ flex: 1, backgroundColor: COLORS.paleGreen }}>
				{renderHeader()}
				<View style={{ flex: 1, alignItems: "center", marginBottom: 70 }}>
					{isLoading ? (
						<Text style={{ marginTop: 20 }}>Loading...</Text>
					) : error ? (
						<Text style={{ marginTop: 20 }}>Failed to load favourites</Text>
					) : (
						<FlatList
							contentContainerStyle={{
								// backgroundColor: "red",
								width: "100%",
								padding: 0,
								margin: 0,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							data={Array.isArray(items) ? items : []}
							keyExtractor={(item: any, index) => item?.id || item?.productId || String(index)}
							renderItem={({ item }: any) => {
								const name = item?.productNameAr || item?.productNameEn || item?.nameAr || item?.nameEn || item?.name || "";
								const price = item?.unitPrice || item?.price || item?.variants?.[0]?.price || 0;
								const rating = item?.rating || 4;
								const imagePath = item?.image?.path || item?.imagePath;
								const imageSource = imagePath ? { uri: `http://10.0.2.2:4000${imagePath}` } : orange;
								return (
									<ProductCardHorizintal
										icon="heart"
										name={name}
										image={imageSource as any}
										price={String(price)}
										rating={rating}
										productId={item?.product?.id || item?.id}
									/>
								);
							}}
						/>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		marginTop: 10,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerLogo: {
		height: 36,
		width: 36,
		tintColor: COLORS.primary,
	},
	headerTitle: {
		fontSize: 20,
		fontFamily: "bold",
		color: COLORS.black,
		marginRight: 12,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	searchIcon: {
		width: 24,
		height: 24,
		tintColor: COLORS.black,
	},
	moreCircleIcon: {
		width: 24,
		height: 24,
		tintColor: COLORS.black,
		marginLeft: 12,
	},
});
export default Fav;

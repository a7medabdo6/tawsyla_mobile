import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	FlatList,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import { COLORS, SIZES, icons, images } from "@/constants";
import { Image } from "expo-image";
import { NavigationProp } from "@react-navigation/native";
import SubHeaderItem from "@/components/SubHeaderItem";
import { transactionHistory } from "@/data";
import TransactionHistoryCard from "@/components/TransactionHistoryCard";
import { useNavigation, useFocusEffect } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { useLanguageContext } from "@/contexts/LanguageContext";
import CategoryCarousel from "@/components/CategoryList";
import Spinner from "react-native-loading-spinner-overlay";
import ProductCard from "@/components/Product";
import { useProducts } from "@/data/useHome";
import ProductHomeList from "@/components/ProductHomeList";
import { useAppStatus } from "@/data/useAppStatus";
import { useQueryClient } from "@tanstack/react-query";
const orange = require("../../assets/images/orange.png");

const Home = () => {
	const navigation = useNavigation<NavigationProp<any>>();
	const { t, isRTL } = useLanguageContext();
	const [loader, setLoader] = useState(false);
	const queryClient = useQueryClient();
	
	// Check cart and favourites status on app load
	const { data: appStatus, refetch } = useAppStatus();

	// Refetch app status each time the screen is focused
	useFocusEffect(
		React.useCallback(() => {
			refetch();
		}, [refetch])
	);

	/**
	 * Render header
	 */ // CarouselExample.tsx

	const { width } = Dimensions.get("window");

	const colors = ["#FF6B6B", "#4ECDC4", "#1A535C", "#FFFCB9"];
	const RenderWalletCard = () => {
		return (
			<View style={styles.item}>
				<View style={styles.cardContainer}>
					<View style={styles.topCardContainer}>
						<View style={styles.topCardLeftContainer}>
							<Text style={styles.cardHolderName}>Andrew Ainsley</Text>
							<Text style={styles.cardNumber}>•••• •••• •••• ••••</Text>
						</View>
						<View style={styles.topCardRightContainer}>
							<Text style={styles.cardType}>VISA</Text>
							<Image
								source={icons.masterCardLogo}
								contentFit="contain"
								style={styles.cardLogo}
							/>
						</View>
					</View>
					{/* <Text style={styles.balanceText}>Your balance</Text> */}
					<View style={styles.bottomCardContainer}>
						<Text style={styles.amountNumber}>$9,729</Text>
						<TouchableOpacity
							onPress={() => navigation.navigate("topupamount")}
							style={styles.topupBtn}
						>
							<Image
								source={icons.arrowDownSquare}
								contentFit="contain"
								style={styles.arrowDown}
							/>
							<Text style={styles.topupBtnText}>Top Up</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	};
	const CarouselExample = () => {
		const [currentIndex, setCurrentIndex] = useState(0);

		return (
			<View style={styles.containerCar}>
				<Carousel
					loop
					width={width}
					height={180}
					onSnapToItem={(index) => setCurrentIndex(index)}
					autoPlay={false}
					data={colors}
					autoPlayReverse={true}
					pagingEnabled
					scrollAnimationDuration={1000}
					renderItem={({ index }) => <RenderWalletCard />}
				/>
				<View style={styles.pagination}>
					{colors.map((_, index) => (
						<View
							key={index}
							style={[
								styles.dot,
								currentIndex === index ? styles.activeDot : null,
							]}
						/>
					))}
				</View>
			</View>
		);
	};

	const renderHeader = () => {
		return (
			<View style={styles.headerContainer}>
				<View style={styles.viewLeft}>
					<Image
						source={images.user1}
						contentFit="contain"
						style={styles.userIcon}
					/>
					<View style={styles.viewNameContainer}>
						<Text style={styles.greeeting}>Good Morning👋</Text>
						<Text
							style={[
								styles.title,
								{
									color: COLORS.greyscale900,
								},
							]}
						>
							Andrew Ainsley
						</Text>
					</View>
				</View>
				<View style={styles.viewRight}>
					<TouchableOpacity
						onPress={() => navigation.navigate("notifications")}
					>
						<Image
							source={icons.notificationBell2}
							contentFit="contain"
							style={[styles.bellIcon, { tintColor: COLORS.greyscale900 }]}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	/**
	 * Render wallet card
	 */

	/**
	 * Render search bar
	 */
	const renderSearchBar = () => {
		const handleInputFocus = () => {
			// Redirect to another screen
			// navigation.navigate("trackidnumber");
		};

		return (
			<TouchableOpacity
				// onPress={() => navigation.navigate("Search")}
				style={[
					styles.searchBarContainer,
					{
						backgroundColor: COLORS.paleGreen,
					},
				]}
			>
				<TouchableOpacity>
					<Image
						source={icons.search2}
						contentFit="contain"
						style={styles.searchIcon}
					/>
				</TouchableOpacity>
				<TextInput
					placeholder="بحث ..."
					placeholderTextColor={COLORS.black2}
					style={styles.searchInput}
					onFocus={handleInputFocus}
				/>
			</TouchableOpacity>
		);
	};

	const renderServices = () => {
		return (
			<View>
				<View style={styles.rowContainer}>
					<TouchableOpacity
						onPress={() => navigation.navigate("orderform")}
						style={styles.serviceContainer}
					>
						<View style={styles.iconContainer}>
							<Image
								source={icons.editService2}
								contentFit="contain"
								style={styles.icon}
							/>
						</View>
						<Text
							style={[
								styles.serviceTitle,
								{
									color: COLORS.black,
								},
							]}
						>
							Make Order
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate("checkrates")}
						style={styles.serviceContainer}
					>
						<View style={styles.iconContainer}>
							<Image
								source={icons.dollarSymbol}
								contentFit="contain"
								style={styles.icon}
							/>
						</View>
						<Text
							style={[
								styles.serviceTitle,
								{
									color: COLORS.black,
								},
							]}
						>
							Check Rates
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.rowContainer}>
					<TouchableOpacity
						onPress={() => navigation.navigate("nearbydrop")}
						style={styles.serviceContainer}
					>
						<View style={styles.iconContainer}>
							<Image
								source={icons.pin}
								contentFit="contain"
								style={styles.icon}
							/>
						</View>
						<Text
							style={[
								styles.serviceTitle,
								{
									color: COLORS.black,
								},
							]}
						>
							Nearby Drop
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate("settingshelpcenter")}
						style={styles.serviceContainer}
					>
						<View style={styles.iconContainer}>
							<Image
								source={icons.dollarSymbol}
								contentFit="contain"
								style={styles.icon}
							/>
						</View>
						<Text
							style={[
								styles.serviceTitle,
								{
									color: COLORS.black,
								},
							]}
						>
							Help Center
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	};
	/**
	 * render transaction history
	 */
	const renderTransactionHistory = () => {
		return (
			<View>
				<SubHeaderItem
					title="Transaction History"
					navTitle="See All"
					onPress={() => navigation.navigate("transactionhistory")}
				/>
				<FlatList
					data={transactionHistory.slice(0, 5)}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<TransactionHistoryCard
							title={item.title}
							description={item.description}
							date={item.date}
							type={item.type}
							onPress={() => console.log("Click")}
						/>
					)}
				/>
			</View>
		);
	};
	/**
	 * Render home screen
	 */

	return (
		<SafeAreaView style={styles.area}>
			<View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
				<Spinner
					visible={loader}
					// textContent={"Loading..."}
					color={COLORS.white}
					textStyle={styles.spinnerTextStyle}
				/>
				{renderHeader()}
				<ScrollView showsVerticalScrollIndicator={false}>
					{renderSearchBar()}
					<CarouselExample />
					<CategoryCarousel />
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							width: "100%",
							justifyContent: "space-between",
						}}
					>
						<ProductHomeList />
					</View>

					{/* {renderWalletCard()} */}
					{renderServices()}
					{renderTransactionHistory()}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerCar: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	item: {
		flex: 1,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 10,
	},
	pagination: {
		flexDirection: "row",
		marginTop: 16,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#ccc",
		marginHorizontal: 5,
	},
	activeDot: {
		backgroundColor: COLORS.primary,
	},
	area: {
		flex: 1,
		backgroundColor: COLORS.white,
	},
	container: {
		flex: 1,
		backgroundColor: COLORS.paleGreen,
		padding: 16,
	},
	headerContainer: {
		flexDirection: "row",
		width: SIZES.width - 32,
		justifyContent: "space-between",
		alignItems: "center",
	},
	userIcon: {
		width: 48,
		height: 48,
		borderRadius: 32,
	},
	viewLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	greeeting: {
		fontSize: 12,
		fontFamily: "regular",
		color: "gray",
		marginBottom: 4,
	},
	title: {
		fontSize: 20,
		fontFamily: "bold",
		color: COLORS.greyscale900,
	},
	viewNameContainer: {
		marginLeft: 12,
	},
	viewRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	bellIcon: {
		height: 24,
		width: 24,
		tintColor: COLORS.black,
		marginRight: 8,
	},
	bookmarkIcon: {
		height: 24,
		width: 24,
		tintColor: COLORS.black,
	},
	cardContainer: {
		width: SIZES.width - 32,
		borderRadius: 12,
		marginTop: 16,
		height: 150,
		backgroundColor: COLORS.primary,
		padding: 16,
	},
	topCardContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	topCardLeftContainer: {
		marginTop: 6,
	},
	topCardRightContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 22,
	},
	cardHolderName: {
		fontSize: 22,
		color: COLORS.white,
		fontFamily: "bold",
	},
	cardNumber: {
		fontSize: 20,
		color: COLORS.white,
		fontFamily: "semiBold",
	},
	cardType: {
		fontSize: 26,
		color: COLORS.white,
		fontFamily: "extraBoldItalic",
	},
	cardLogo: {
		height: 52,
		width: 52,
		marginLeft: 6,
	},
	balanceText: {
		fontSize: 18,
		color: COLORS.white,
		fontFamily: "medium",
	},
	bottomCardContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 8,
	},
	amountNumber: {
		fontSize: 42,
		color: COLORS.white,
		fontFamily: "bold",
	},
	topupBtn: {
		width: 132,
		height: 42,
		backgroundColor: COLORS.white,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	arrowDown: {
		width: 16,
		height: 16,
		tintColor: COLORS.primary,
	},
	topupBtnText: {
		fontSize: 16,
		color: COLORS.primary,
		fontFamily: "semiBold",
		marginLeft: 12,
	},
	searchBarContainer: {
		width: SIZES.width - 32,
		// backgroundColor: COLORS.primary,
		paddingHorizontal: 16,
		borderRadius: 12,
		height: 52,
		marginTop: 16,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 0,
		justifyContent: "center",
	},
	searchIcon: {
		height: 24,
		width: 24,
		tintColor: COLORS.gray,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		fontFamily: "regular",
		marginHorizontal: 8,
		color: COLORS.primary,
		textAlign: "right",
		// backgroundColor: "red",
	},
	filterIcon: {
		width: 24,
		height: 24,
		tintColor: COLORS.primary,
	},
	rowContainer: {
		width: SIZES.width - 32,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 8,
	},
	serviceContainer: {
		width: (SIZES.width - 52) / 2,
		height: 120,
		borderWidth: 1,
		borderColor: "rgba(34, 187, 156, 0.2)",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 16,
	},
	iconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "rgba(34, 187, 156, 0.1)",
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		height: 24,
		width: 24,
		tintColor: COLORS.primary,
	},
	serviceTitle: {
		fontSize: 16,
		color: COLORS.black,
		fontFamily: "semiBold",
		textAlign: "center",
		marginTop: 8,
	},
	spinnerTextStyle: {
		color: COLORS.primary,
	},
});

export default Home;

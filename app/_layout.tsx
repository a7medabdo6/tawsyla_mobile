import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { FONTS } from "@/constants/fonts";
import { LogBox } from "react-native";
import { LanguageProvider } from "../contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStatus } from "@/data/useAppStatus";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Ignore all log notifications
LogBox.ignoreAllLogs();
const queryClient = new QueryClient();

function AppStatusChecker() {
	// Check cart and favourites status on app load
	useAppStatus();
	return null;
}

export default function RootLayout() {
	const [loaded] = useFonts(FONTS);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<LanguageProvider>
				<AppStatusChecker />
				<Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" />
					<Stack.Screen name="onboarding2" />
					<Stack.Screen name="onboarding3" />
					<Stack.Screen name="onboarding4" />
					<Stack.Screen name="welcome" />
					<Stack.Screen name="login" />
					<Stack.Screen name="signup" />
					<Stack.Screen name="forgotpasswordmethods" />
					<Stack.Screen name="forgotpasswordphonenumber" />
					<Stack.Screen name="forgotpasswordemail" />
					<Stack.Screen name="otpverification" />
					<Stack.Screen name="createnewpin" />
					<Stack.Screen name="reasonforusingsaska" />
					<Stack.Screen name="verifyyouridentity" />
					<Stack.Screen name="proofofresidency" />
					<Stack.Screen name="photoidcard" />
					<Stack.Screen name="selfiewithidcard" />
					<Stack.Screen name="facerecognitionwalkthrough" />
					<Stack.Screen name="facerecognitionscan" />
					<Stack.Screen name="fillyourprofile" />
					<Stack.Screen name="fingerprint" />
					<Stack.Screen name="createnewpassword" />
					<Stack.Screen name="addnewaddress" />
					<Stack.Screen name="address" />
					<Stack.Screen name="addnewcard" />
					<Stack.Screen name="changeemail" />
					<Stack.Screen name="changepassword" />
					<Stack.Screen name="changepin" />
					<Stack.Screen name="customerservice" />
					<Stack.Screen name="settingshelpcenter" />
					<Stack.Screen name="settingsinvitefriends" />
					<Stack.Screen name="settingslanguage" />
					<Stack.Screen name="settingsnotifications" />
					<Stack.Screen name="settingspayment" />
					<Stack.Screen name="settingsprivacypolicy" />
					<Stack.Screen name="settingssecurity" />
					<Stack.Screen name="notifications" />
					<Stack.Screen name="call" />
					<Stack.Screen name="chat" />
					<Stack.Screen name="transactionhistory" />
					<Stack.Screen name="topupamount" />
					<Stack.Screen name="topupmethods" />
					<Stack.Screen name="topupconfirmpin" />
					<Stack.Screen name="topupereceipt" />
					<Stack.Screen name="trackidnumber" />
					<Stack.Screen name="trackingpackage" />
					<Stack.Screen name="ratethecourier" />
					<Stack.Screen name="givetipforcourier" />
					<Stack.Screen name="whatsyourmood" />
					<Stack.Screen name="writereview" />
					<Stack.Screen name="checkrates" />
					<Stack.Screen name="nearbydrop" />
					<Stack.Screen name="orderform" />
					<Stack.Screen name="orderdetails" />
					<Stack.Screen name="ereceipt" />
					<Stack.Screen name="myordertrack" />
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="editprofile" />
					<Stack.Screen name="+not-found" />
				</Stack>
			</LanguageProvider>
		</QueryClientProvider>
	);
}

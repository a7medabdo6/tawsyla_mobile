import { View, StyleSheet, FlatList } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ScrollView } from "react-native-virtualized-view";
import Button from "../components/Button";
import { useNavigation, useRouter } from "expo-router";
import { userAddresses } from "@/data";
import UserAddressItem from "@/components/UserAddressItem";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useAddAddress, useAddress } from "@/data/useAddress";

type Nav = {
  navigate: (value: string) => void;
};

// user address location screen
const Address = () => {
  const { navigate } = useNavigation<Nav>();
  const { t, isRTL } = useLanguageContext();
  const { data, isLoading } = useAddress();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" },
      ]}
    >
      <Header title={t("Address")} />
      <View
        style={[
          styles.container,
          { backgroundColor: COLORS.white, paddingHorizontal: 16 },
        ]}
      >
        <ScrollView
          contentContainerStyle={{ marginVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UserAddressItem
                name={`${item.city} - ${item.state}`}
                address={item.additionalInfo}
                isDefault={item?.isDefault}
                onPress={() =>
                  router.push({
                    pathname: "/addnewaddress",
                    params: {
                      id: item?.id,
                    },
                  })
                }
              />
            )}
          />
        </ScrollView>
      </View>
      <View style={styles.btnContainer}>
        <Button
          title={t("Add New Address")}
          onPress={() => navigate("addnewaddress")}
          filled
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  btnContainer: {
    alignItems: "center",
  },
  btn: {
    width: SIZES.width - 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default Address;

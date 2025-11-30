import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { COLORS } from "../constants";
import { NavigationProp } from "@react-navigation/native";
import { incomingShipments } from "@/data";
import { useNavigation } from "expo-router";
import OrderCard from "@/components/OrderCard";

const ToMeRoute = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <OrderCard
        index={index}
        title={item.trackingNumber}
        subtitle={`${item.address} • ${item.numberOfItems} Items`}
        price={`$${item.price}`}
        status={item.type}
        statusColor={COLORS.primary}
        image={item.image}
        onPress={() => navigation.navigate("ereceipt")}
        actions={
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate("myordertrack")}
              style={styles.filledButton}
            >
              <Text style={styles.filledButtonText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ereceipt")}
              style={styles.outlineButton}
            >
              <Text style={styles.outlineButtonText}>View</Text>
            </TouchableOpacity>
          </>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={incomingShipments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondaryWhite,
  },
  outlineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: "bold",
  },
  filledButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  filledButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "bold",
  },
});

export default ToMeRoute;

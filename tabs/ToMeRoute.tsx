import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { NavigationProp } from '@react-navigation/native';
import { incomingShipments } from '@/data';
import { useNavigation } from 'expo-router';

const ToMeRoute = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <FlatList
        data={incomingShipments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={styles.typeContainer}>
              <Text style={[styles.typeText, {
                color: COLORS.black,
              }]}>{item.type}</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoLeft}>
                <Image
                  source={item.image}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, {
                    color: COLORS.black,
                  }]}>{item.trackingNumber}</Text>
                  <View style={styles.itemSubDetails}>
                    <Text style={styles.itemPrice}>${item.price}</Text>
                    <Text style={[styles.itemItems, {
                      color: COLORS.grayscale700,
                    }]}> | ${item.address}  | {item.numberOfItems} Items</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.receiptText, {
                color: COLORS.grayscale700
              }]}>{item.receipt}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("myordertrack")}
                style={styles.trackOrderButton}>
                <Text style={styles.trackOrderButtonText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ereceipt")}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'column',
  },
  typeContainer: {
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: .4,
    marginVertical: 12,
    paddingBottom: 4,
  },
  typeText: {
    fontSize: 14,
    fontFamily: "bold",
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    height: 60,
    width: 60,
    borderRadius: 8,
  },
  itemDetails: {
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemSubDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: "bold",
    color: COLORS.primary
  },
  itemItems: {
    fontSize: 12,
    fontFamily: "regular",
  },
  receiptText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.gray,
    fontFamily: "regular",
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18,
  },
  trackOrderButton: {
    height: 38,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  trackOrderButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "regular",
  },
  cancelButton: {
    height: 38,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "regular",
  },
});

export default ToMeRoute;
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { NavigationProp } from '@react-navigation/native';
import { outgoingShipments } from '@/data';
import { useNavigation } from 'expo-router';

const FromMeRoute = () => {
    const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <FlatList
        data={outgoingShipments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={styles.statusContainer}>
              <Text style={[styles.typeText, { 
                color: COLORS.black,
              }]}>{item.type}</Text>
              <Text style={[styles.statusText, { color: item.status == "Completed" ? "green" : COLORS.red, marginLeft: 12 }]}>
                {item.status}
              </Text>
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
                    <Text style={[styles.itemDate, { 
                      color: COLORS.grayscale700,
                    }]}> | {item.date}</Text>
                    <Text style={[styles.itemItems, { 
                      color: COLORS.grayscale700,
                    }]}> | {item.numberOfItems} Items</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.receiptText, { 
                color: COLORS.grayscale700,
              }]}>{item.receipt}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                onPress={()=>navigation.navigate("ereceipt")}
                style={styles.rateButton}>
                <Text style={styles.rateButtonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity 
               onPress={()=>navigation.navigate("myordertrack")}
               style={styles.reorderButton}>
                <Text style={styles.reorderButtonText}>Track Order</Text>
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
  statusContainer: {
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: .4,
    marginVertical: 12,
    flexDirection: 'row',
    paddingBottom: 4,
  },
  typeText: {
    fontSize: 14,
    fontFamily: "bold",
  },
  statusText: {
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
  itemDate: {
    fontSize: 12,
    fontFamily: "regular",
    marginHorizontal: 2,
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
  rateButton: {
    height: 38,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
  },
  rateButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "regular",
  },
  reorderButton: {
    height: 38,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  reorderButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "regular",
  },
});

export default FromMeRoute
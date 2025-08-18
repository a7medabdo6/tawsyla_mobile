import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '../components/Button';
import Rating from '@/components/Rating';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

// rate the courier
const RateTheCourier = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Image
              source={images.user3}
              resizeMode='contain'
              style={styles.avatar}
            />
            <Text style={[styles.rateName, {
              color: COLORS.greyscale900
            }]}>Le's rate your courier's delivery service</Text>
            <Text style={[styles.rateText, {
              color: COLORS.grayscale700,
            }]}>
              How was the delivery of your order from Big Garden Salad?
            </Text>
            <Rating color="orange" size={40} />
            <View style={[styles.separateLine, {
              backgroundColor: COLORS.grayscale200
            }]} />
            <Text style={[styles.viewSubtitle, {
              color: COLORS.grayscale700,
            }]}>
              Haven't received your order ?
            </Text>
            <TouchableOpacity>
              <Text style={styles.driverName}>
                Call your driver?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={[styles.bottomContainer, {
        backgroundColor: COLORS.white,
      }]}>
        <Button
          title="Cancel"
          style={styles.cancelBtn}
        />
        <Button
          title="Submit"
          filled
          style={styles.submitBtn}
          onPress={() => navigation.navigate("givetipforcourier")}
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  contentContainer: {
    alignItems: "center",
  },
  avatar: {
    height: 132,
    width: 132,
    borderRadius: 999,
    marginVertical: 12
  },
  rateName: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  rateText: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 12
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200
  },
  viewSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 12
  },
  driverName: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 112,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36
  },
  cancelBtn: {
    width: (SIZES.width - 48) / 2,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary
  },
  submitBtn: {
    width: (SIZES.width - 48) / 2,
  }
})

export default RateTheCourier
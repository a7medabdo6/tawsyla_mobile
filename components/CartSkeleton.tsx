import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS } from "@/constants";

const CartSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonCard = () => (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.imageContainer}>
        <View style={styles.imageSkeleton} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <View style={styles.nameSkeleton} />
          <View style={styles.deleteButtonSkeleton} />
        </View>

        <View style={styles.descriptionSkeleton} />

        <View style={styles.bottomRow}>
          <View style={styles.quantityControlSkeleton} />
          <View style={styles.ratingSkeleton} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "95%",
    height: 130,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    margin: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imageContainer: {
    width: "35%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  imageSkeleton: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.gray,
    borderRadius: 16,
  },
  contentContainer: {
    width: "65%",
    paddingHorizontal: 10,
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  nameSkeleton: {
    width: "70%",
    height: 16,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  deleteButtonSkeleton: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.gray,
    borderRadius: 12,
  },
  descriptionSkeleton: {
    width: "90%",
    height: 12,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
    marginTop: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "auto",
  },
  quantityControlSkeleton: {
    width: 100,
    height: 30,
    backgroundColor: COLORS.gray,
    borderRadius: 15,
  },
  ratingSkeleton: {
    width: 80,
    height: 12,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
});

export default CartSkeleton;

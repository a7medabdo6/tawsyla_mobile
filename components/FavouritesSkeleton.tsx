import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS } from "@/constants";

const FavouritesSkeleton = () => {
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
          <View style={styles.priceSkeleton} />
        </View>

        <View style={styles.descriptionSkeleton} />
        <View style={styles.descriptionSkeletonShort} />

        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.starSkeleton} />
          ))}
        </View>
      </View>

      <View style={styles.deleteButtonSkeleton} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SkeletonCard />
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
    height: 120,
    backgroundColor: COLORS.paleGreen,
    borderRadius: 16,
    padding: 5,
    margin: 5,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageContainer: {
    width: "40%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  imageSkeleton: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    marginVertical: 10,
  },
  contentContainer: {
    width: "60%",
    paddingHorizontal: 10,
    height: "100%",
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  nameSkeleton: {
    width: "60%",
    height: 14,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  priceSkeleton: {
    width: "30%",
    height: 16,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  descriptionSkeleton: {
    width: "90%",
    height: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
    marginTop: 4,
  },
  descriptionSkeletonShort: {
    width: "70%",
    height: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: 6,
  },
  starSkeleton: {
    width: 14,
    height: 14,
    backgroundColor: COLORS.gray,
    borderRadius: 7,
    marginRight: 2,
  },
  deleteButtonSkeleton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 34,
    backgroundColor: COLORS.gray,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 16,
  },
});

export default FavouritesSkeleton;

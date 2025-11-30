import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { COLORS } from "@/constants";

const OrdersSkeleton = () => {
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
      <View style={styles.headerRow}>
        <View style={styles.orderNumberSkeleton} />
        <View style={styles.statusBadgeSkeleton} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.labelSkeleton} />
        <View style={styles.valueSkeleton} />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.labelSkeleton} />
        <View style={styles.valueSkeletonLong} />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.labelSkeleton} />
        <View style={styles.valueSkeleton} />
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.totalSkeleton} />
        <View style={styles.buttonSkeleton} />
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
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumberSkeleton: {
    width: 120,
    height: 18,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  statusBadgeSkeleton: {
    width: 80,
    height: 28,
    backgroundColor: COLORS.gray,
    borderRadius: 14,
  },
  divider: {
    height: 1,
    backgroundColor: `${COLORS.gray}30`,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelSkeleton: {
    width: 60,
    height: 14,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  valueSkeleton: {
    width: 100,
    height: 14,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  valueSkeletonLong: {
    width: 150,
    height: 14,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalSkeleton: {
    width: 100,
    height: 20,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
  },
  buttonSkeleton: {
    width: 100,
    height: 36,
    backgroundColor: COLORS.gray,
    borderRadius: 18,
  },
});

export default OrdersSkeleton;

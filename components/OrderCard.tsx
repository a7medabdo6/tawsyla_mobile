import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeInUp,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { COLORS, FONTS, SHADOWS, SPACING, SIZES } from "@/constants/theme";
import { SimpleLineIcons } from "@expo/vector-icons";

interface OrderCardProps {
  title: string;
  subtitle?: string;
  price?: string | number;
  status?: string;
  statusColor?: string;
  image?: string | ImageSourcePropType;
  icon?: keyof typeof SimpleLineIcons.glyphMap;
  onPress?: () => void;
  actions?: React.ReactNode;
  index?: number;
}

const OrderCard: React.FC<OrderCardProps> = ({
  title,
  subtitle,
  price,
  status,
  statusColor = COLORS.primary,
  image,
  icon,
  onPress,
  actions,
  index = 0,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
    if (onPress) onPress();
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).springify()}
      style={[styles.container, SHADOWS.light]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.cardContent, animatedStyle]}>
          <View style={styles.header}>
            <View style={styles.imageContainer}>
              {image ? (
                <Image source={image} style={styles.image} contentFit="cover" />
              ) : (
                <View
                  style={[
                    styles.iconPlaceholder,
                    { backgroundColor: COLORS.paleGreen },
                  ]}
                >
                  <SimpleLineIcons
                    name={icon || "bag"}
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
              )}
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                {status && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor + "20" },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {status}
                    </Text>
                  </View>
                )}
              </View>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              {price && <Text style={styles.price}>{price}</Text>}
            </View>
          </View>

          {actions && (
            <View style={styles.actionsContainer}>
              <View style={styles.divider} />
              <View style={styles.actionsContent}>{actions}</View>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
    marginHorizontal: 0,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  cardContent: {
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginLeft: SPACING.m,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: SIZES.sm_radius,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: SIZES.sm_radius,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.black,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    ...FONTS.body4,
    fontSize: 10,
    fontWeight: "bold",
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grayscale100,
    marginVertical: SPACING.m,
  },
  actionsContainer: {
    marginTop: SPACING.xs,
  },
  actionsContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.s,
  },
});

export default OrderCard;

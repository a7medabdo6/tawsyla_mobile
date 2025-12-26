import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { COLORS } from "../constants";

interface PaymentItemProps {
  checked: boolean;
  onPress: () => void;
  title: string;
  number: string;
  icon: ImageSourcePropType;
  onSelect: (selected: boolean) => void;
}

const PaymentItem: React.FC<PaymentItemProps> = ({
  checked,
  onPress,
  title,
  number,
  icon,
  onSelect,
}) => {
  const borderColor = checked ? COLORS.primary : COLORS.gray;

  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(!checked);
        onPress();
      }}
      style={[
        styles.container,
        { borderColor, borderWidth: checked ? 1 : 0.4 },
      ]}
    >
      <View style={styles.rightContainer}>
        <View style={styles.pkgContainer}>
          <Image source={icon} resizeMode="cover" style={styles.pkgIcon} />
        </View>
        <View>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.black,
              },
            ]}
          >
            {title}
          </Text>
          <Text style={styles.number}>{number}</Text>
        </View>
      </View>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={{
            marginHorizontal: 16,
            width: 20,
            height: 20,
            borderColor: checked ? COLORS.primary : COLORS.gray,
            borderWidth: checked ? 6 : 2,
            borderRadius: 999,
          }}
        ></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    borderWidth: 1,
    borderColor: COLORS.grayscale100,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pkgContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
    marginRight: 16,
  },
  pkgIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  title: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.black,
    marginBottom: 8,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});

export default PaymentItem;

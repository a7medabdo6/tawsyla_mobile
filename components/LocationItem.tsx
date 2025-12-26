import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, SIZES, icons } from "../constants";

interface LocationItemProps {
  location: string;
  address: string;
  distance: string;
  onPress: () => void;
}

const LocationItem: React.FC<LocationItemProps> = ({
  location,
  address,
  distance,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={icons.pin} resizeMode="contain" style={styles.pinIcon} />
        <View>
          <Text
            style={[
              styles.location,
              {
                color: COLORS.black,
              },
            ]}
          >
            {location}
          </Text>
          <Text style={styles.address}>{address}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.distance,
          {
            color: COLORS.black,
          },
        ]}
      >
        {distance}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: SIZES.width - 32,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  pinIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
    marginRight: 12,
  },
  location: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  distance: {
    fontSize: 12,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default LocationItem;

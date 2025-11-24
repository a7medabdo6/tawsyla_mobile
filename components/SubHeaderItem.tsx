import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

interface SubHeaderItemProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  navTitle?: string;
}

const SubHeaderItem: React.FC<SubHeaderItemProps> = ({ title, onPress, navTitle }) => {

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {
        color: COLORS.greyscale900
      }]}>{title}</Text>
      {navTitle && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.navTitle}>{navTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 14,
     fontFamily: "bold",
    color: COLORS.black,
  },
  navTitle: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 12,
  },
});

export default SubHeaderItem;
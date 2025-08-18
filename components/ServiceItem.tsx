import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { COLORS } from '../constants';

interface ServiceItemProps {
  pkgIcon: ImageSourcePropType;
  title: string;
  duration: string;
  price: string;
  onPress: () => void;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ pkgIcon, title, duration, price, onPress, isSelected, onSelect }) => {
  const borderColor = isSelected ? COLORS.primary : COLORS.grayscale100;

  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(!isSelected);
        onPress();
      }}
      style={[styles.container, { borderColor }]}>
      <View style={styles.leftContainer}>
        <View style={styles.pkgContainer}>
          <Image
            source={pkgIcon}
            resizeMode='cover'
            style={styles.pkgIcon}
          />
        </View>
        <View>
          <Text style={[styles.title, { 
            color: COLORS.black,
          }]}>{title}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
      </View>
      <Text style={{
        color: COLORS.black,
      }}>{price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    borderWidth: 1,
    borderColor: COLORS.grayscale100,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pkgContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
    marginRight: 16,
  },
  pkgIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary
  },
  title: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.black,
    marginBottom: 6,
  },
  duration: {
    fontSize: 14,
    fontFamily: 'regular',
    color: 'gray',
  },
  price: {
    fontSize: 12,
    fontFamily: 'bold',
    color: COLORS.black,
  },
});

export default ServiceItem;

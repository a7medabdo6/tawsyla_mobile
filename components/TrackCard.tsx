import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '@/constants';

interface TrackCardProps {
  number: string;
  status: string;
  description: string;
  onPress: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ 
  number,
  status,
  description,
  onPress
}) => {

  return (
    <TouchableOpacity 
      style={[styles.container ,{ 
        backgroundColor: COLORS.white,
      }]} 
      onPress={onPress}>
      <View style={styles.viewLeft}>
        <View style={styles.packageContainer}>
          <Image
            source={icons.package1}
            resizeMode='contain'
            style={styles.packageIcon}
          />
        </View>
        <View>
          <Text style={[styles.number, { 
            color: COLORS.greyscale900,
          }]}>{number}</Text>
          <Text style={[styles.description, { 
            color: COLORS.grayscale700
          }]}>{description}</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    height: 76,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#FCF",
    shadowOffset: {
      width: 0,
      height: .2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
  },
  packageContainer: {
    height: 64,
    width: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    marginRight: 12
  },
  packageIcon: {
    height: 28,
    width: 28,
    tintColor: COLORS.primary
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  number: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 6
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700
  },
  statusContainer: {
    width: 82,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary
  },
  status: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary
  }
});

export default TrackCard;

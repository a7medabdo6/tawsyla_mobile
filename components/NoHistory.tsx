import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { COLORS, illustrations } from '../constants';

const NoHistory = () => {

  return (
    <View style={styles.container}>
      <Image
        source={illustrations.notFound}
        resizeMode='contain'
        style={styles.notFound}
      />
      <Text style={[styles.title, { 
        color: COLORS.black,
      }]}>You Have No History  Yet</Text>
      <Text style={[styles.subtitle, { 
        color: COLORS.black,
      }]}>When tracking history appear, you will see them here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },
    notFound: {
        width: 160,
        height: 160,
        marginVertical: 72
    },
    title: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.black,
        marginBottom: 12,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.black,
        textAlign: "center"
    }
})

export default NoHistory
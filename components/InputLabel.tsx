import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';

interface InputLabelProps {
  title: string;
}

const InputLabel: React.FC<InputLabelProps> = ({ title }) => {

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { 
        color: COLORS.black
      }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.black,
  },
});

export default InputLabel;

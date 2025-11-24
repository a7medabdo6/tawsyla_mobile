import { TextStyle } from 'react-native';

type FontWeight = 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraLight';

export const getCairoFont = (weight: FontWeight = 'regular'): TextStyle => {
  return {
    fontFamily: `Cairo-${weight.charAt(0).toUpperCase() + weight.slice(1).replace(/([A-Z])/g, '-$1').toLowerCase()}`,
  };
};

// Example usage:
// <Text style={[styles.text, getCairoFont('semiBold')]}>Some text</Text>;

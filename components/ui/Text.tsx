import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { getCairoFont } from '@/utils/fonts';

type TextProps = RNTextProps & {
  weight?: 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraLight';
};

export const Text: React.FC<TextProps> = ({
  style,
  weight = 'regular',
  children,
  ...props
}) => {
  return (
    <RNText
      style={[getCairoFont(weight), style]}
      allowFontScaling={false}
      {...props}
    >
      {children}
    </RNText>
  );
};

// Usage:
// <Text weight="bold">Bold text</Text>
// <Text weight="regular">Regular text</Text>
// <Text style={{ color: 'red' }}>Custom style</Text>

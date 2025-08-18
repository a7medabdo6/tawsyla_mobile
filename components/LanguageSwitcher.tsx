import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants';
import { useLanguageContext } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, isRTL } = useLanguageContext();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'en' ? 'ar' : 'en');
  };

  return (
    <View style={[styles.container, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
      <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
        <Text style={styles.buttonText}>
          {currentLanguage === 'en' ? 'العربية' : 'English'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher; 
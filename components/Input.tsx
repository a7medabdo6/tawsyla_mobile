import React, { useState, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";
import { COLORS, SIZES } from "../constants";
import { Image } from "expo-image";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface InputProps extends TextInputProps {
  id: string;
  icon?: string;
  errorText?: string[];
  autoFocus?: boolean;
  onInputChanged: (id: string, text: string) => void;
}

const Input: FC<InputProps> = (props) => {
  const { t, isRTL } = useLanguageContext();

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onChangeText = (text: string) => {
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused ? COLORS.primary : COLORS.greyscale500,
            backgroundColor: isFocused
              ? COLORS.tansparentPrimary
              : COLORS.greyscale500,
          },
        ]}
      >
        <TextInput
          {...props}
          value={props.value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            { color: COLORS.black, textAlign: isRTL ? "right" : "left" },
          ]}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          autoCapitalize="none"
        />
        {props.icon && (
          <Image
            source={props.icon}
            style={[
              styles.icon,
              {
                tintColor: isFocused ? COLORS.primary : "#BCBCBC",
              },
            ]}
          />
        )}
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t(`${props.errorText}`)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: "row",
    height: 52,
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
    height: 20,
    width: 20,
    tintColor: "#BCBCBC",
  },
  input: {
    color: COLORS.black,
    flex: 1,
    fontFamily: "regular",
    fontSize: 14,
    paddingTop: 10,
    height: 40,
    // backgroundColor:"red"
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default Input;

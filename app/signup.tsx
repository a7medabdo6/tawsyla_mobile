import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "../constants";
import Header from "../components/Header";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import Input from "../components/Input";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import OrSeparator from "../components/OrSeparator";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useRegister } from "@/data";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface InputValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

interface InputValidities {
  email: boolean | undefined;
  password: boolean | undefined;
  confirmPassword: boolean | undefined;
  fullName: boolean | undefined;
  phone: boolean | undefined;
}

interface FormState {
  inputValues: InputValues;
  inputValidities: InputValidities;
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  },
  inputValidities: {
    email: false,
    password: false,
    confirmPassword: false,
    fullName: false,
    phone: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const Signup = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);

  // Use the register hook
  const register = useRegister();

  // Use language context
  const { t, isRTL } = useLanguageContext();

  // Create styles with RTL support
  const styles = createStyles(isRTL);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      let result;

      if (inputId === "confirmPassword") {
        // Pass the current password value for confirmPassword validation
        result = validateInput(
          inputId,
          inputValue,
          formState.inputValues.password
        );
      } else {
        result = validateInput(inputId, inputValue);
      }

      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });

      // If this is a password change, also re-validate confirmPassword
      if (inputId === "password" && formState.inputValues.confirmPassword) {
        const confirmPasswordResult = validateInput(
          "confirmPassword",
          formState.inputValues.confirmPassword,
          inputValue
        );
        dispatchFormState({
          inputId: "confirmPassword",
          validationResult: confirmPasswordResult,
          inputValue: formState.inputValues.confirmPassword,
        });
      }
    },
    [
      dispatchFormState,
      formState.inputValues.password,
      formState.inputValues.confirmPassword,
    ]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);

  // Handle registration success and error
  useEffect(() => {
    if (register.isSuccess) {
      // Navigate to main app on successful registration
      navigate("login");
    }
  }, [register.isSuccess, navigate]);

  useEffect(() => {
    if (register.error) {
      Alert.alert(
        "Registration Failed",
        register.error.message || "An error occurred during registration"
      );
    }
  }, [register.error]);

  // implementing apple authentication
  const appleAuthHandler = () => {
    console.log("Apple Authentication");
  };

  // implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log("Facebook Authentication");
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log("Google Authentication");
  };

  // Handle registration form submission
  const handleRegister = () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly"
      );
      return;
    }

    if (!isChecked) {
      Alert.alert(
        "Terms Required",
        "Please accept the Privacy Policy to continue"
      );
      return;
    }

    // Password matching is now handled by the validation system
    // No need for manual check here

    // Split full name into first and last name

    register.mutate({
      phone: formState.inputValues.phone,
      email: formState.inputValues.email,
      password: formState.inputValues.password,
      confirmPassword: formState.inputValues.confirmPassword,
      firstName: formState.inputValues.fullName,
    });
  };

  // Wrapper functions for social auth that respect loading state
  const handleAppleAuth = () => {
    if (!register.isPending) {
      appleAuthHandler();
    }
  };

  const handleFacebookAuth = () => {
    if (!register.isPending) {
      facebookAuthHandler();
    }
  };

  const handleGoogleAuth = () => {
    if (!register.isPending) {
      googleAuthHandler();
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View
        style={{
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <Header title={t("auth.signup.title")} />
      </View>
      <View
        style={[
          styles.container,
          { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              contentFit="contain"
              style={styles.logo}
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.black,
                textAlign: "center",
              },
            ]}
          >
            {t("auth.signup.title")}
          </Text>

          {register.isPending && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                {t("auth.signup.creatingAccount")}
              </Text>
            </View>
          )}

          <Input
            id="fullName"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["fullName"]}
            placeholder={t("auth.signup.fullName")}
            placeholderTextColor={COLORS.black}
            icon={icons.user}
            autoCapitalize="words"
            editable={!register.isPending}
          />
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["email"]}
            placeholder={t("auth.signup.email")}
            placeholderTextColor={COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
            editable={!register.isPending}
          />
          <Input
            id="phone"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["phone"]}
            placeholder={t("auth.signup.phone")}
            placeholderTextColor={COLORS.black}
            icon={icons.mobile}
            editable={!register.isPending}
          />

          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["password"]}
            autoCapitalize="none"
            id="password"
            placeholder={t("auth.signup.password")}
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
            editable={!register.isPending}
          />
          <Input
            id="confirmPassword"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["confirmPassword"]}
            autoCapitalize="none"
            placeholder={t("auth.signup.confirmPassword")}
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
            editable={!register.isPending}
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1, marginHorizontal: 6 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: COLORS.black,
                    },
                  ]}
                >
                  {t("auth.signup.privacyPolicy")}
                </Text>
              </View>
            </View>
          </View>
          <Button
            title={
              register.isPending
                ? t("auth.signup.creatingAccount")
                : t("auth.signup.signUpButton")
            }
            filled
            onPress={handleRegister}
            style={[
              styles.button,
              {
                borderColor:
                  register.isPending || !formState.formIsValid || !isChecked
                    ? COLORS.lightGreen
                    : COLORS.primary,
                backgroundColor:
                  register.isPending || !formState.formIsValid || !isChecked
                    ? COLORS.lightGreen
                    : COLORS.primary,
              },
            ]}
            disabled={
              register.isPending || !formState.formIsValid || !isChecked
            }
          />
          <View style={styles.bottomContainer}>
            <Text
              style={[
                styles.bottomLeft,
                {
                  color: COLORS.black,
                },
              ]}
            >
              {t("auth.signup.hasAccount")}
            </Text>
            <TouchableOpacity
              onPress={() => navigate("login")}
              disabled={register.isPending}
            >
              <Text
                style={[
                  styles.bottomRight,
                  register.isPending && styles.disabledText,
                ]}
              >
                {" "}
                {t("auth.signup.signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (isRTL: boolean) =>
  StyleSheet.create({
    area: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: COLORS.white,
    },
    logo: {
      width: 100,
      height: 100,
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 12,
    },
    title: {
      fontSize: 28,
      fontFamily: "bold",
      color: COLORS.black,
      textAlign: isRTL ? "right" : "center",
      marginBottom: 12,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    checkBoxContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 18,
    },
    checkbox: {
      marginRight: 8,
      height: 16,
      width: 16,
      borderRadius: 4,
      borderColor: COLORS.primary,
      borderWidth: 2,
    },
    privacy: {
      fontSize: 12,
      fontFamily: "regular",
      color: COLORS.black,
    },
    socialTitle: {
      fontSize: 19.25,
      fontFamily: "medium",
      color: COLORS.black,
      textAlign: "center",
      marginVertical: 26,
    },
    socialBtnContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    bottomContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 18,
      // position: "absolute",
      // bottom: 12,
      // right: 0,
      // left: 0,
    },
    bottomLeft: {
      fontSize: 14,
      fontFamily: "regular",
      color: "black",
    },
    bottomRight: {
      fontSize: 16,
      fontFamily: "medium",
      color: COLORS.primary,
    },
    button: {
      marginVertical: 6,
      width: SIZES.width - 32,
      borderRadius: 30,
    },
    loadingContainer: {
      alignItems: "center",
      marginBottom: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: COLORS.primary + "20",
      borderRadius: 8,
    },
    loadingText: {
      fontSize: 14,
      fontFamily: "medium",
      color: COLORS.primary,
    },
    disabledText: {
      opacity: 0.5,
    },
  });

export default Signup;

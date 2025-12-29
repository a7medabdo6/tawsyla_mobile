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
import { useNavigation } from "expo-router";
import { Image } from "expo-image";
import SocialButton from "@/components/SocialButton";
import OrSeparator from "@/components/OrSeparator";
import { useLogin } from "@/data";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface InputValues {
  email: string;
  password: string;
}

interface InputValidities {
  email: boolean | undefined;
  password: boolean | undefined;
}

interface FormState {
  inputValues: InputValues;
  inputValidities: InputValidities;
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    email: "john.doe@example.com",
    password: "secret",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const Login = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);

  const [loginError, setLoginError] = useState<any>(null);

  // Use the login hook
  const login = useLogin();

  // Use language context
  const { t, isRTL } = useLanguageContext();

  // Create styles with RTL support
  const styles = createStyles(isRTL);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);

  // Handle login success and error
  useEffect(() => {
    if (login.isSuccess) {
      // Navigate to main app on successful login
      navigate("(tabs)");
    }
  }, [login.isSuccess, navigate]);

  useEffect(() => {
    if (login.error) {
      // Alert.alert(
      //   "Login Failed",
      //   login.error.message || "An error occurred during login"
      // );
      setLoginError("البريد الالكتروني او كلمة المرور غير صحيح");
    }
  }, [login.error]);

  // Implementing apple authentication
  const appleAuthHandler = () => {
    // console.log("Apple Authentication");
  };

  // Implementing facebook authentication
  const facebookAuthHandler = () => {
    // console.log("Facebook Authentication");
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    // console.log("Google Authentication");
  };

  // Handle login form submission
  const handleLogin = () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly"
      );
      return;
    }

    login.mutate({
      email: formState.inputValues.email,
      password: formState.inputValues.password,
    });
  };

  // Wrapper functions for social auth that respect loading state
  const handleAppleAuth = () => {
    if (!login.isPending) {
      appleAuthHandler();
    }
  };

  const handleFacebookAuth = () => {
    if (!login.isPending) {
      facebookAuthHandler();
    }
  };

  const handleGoogleAuth = () => {
    if (!login.isPending) {
      googleAuthHandler();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        {
          backgroundColor: COLORS.white,
        },
      ]}
    >
      <View style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <Header title="تسجيل الدخول" />
      </View>
      <View
        style={[
          styles.container,
          {
            backgroundColor: COLORS.white,
            direction: isRTL ? "rtl" : "ltr",
          },
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
              },
            ]}
          >
            {t("auth.login.title")}
          </Text>

          {login.isPending && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                {t("auth.login.loggingIn")}
              </Text>
            </View>
          )}
          {loginError && <Text style={styles.errorText}>{loginError}</Text>}
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["email"]}
            placeholder={t("auth.login.email")}
            placeholderTextColor={COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
            editable={!login.isPending}
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["password"]}
            autoCapitalize="none"
            id="password"
            placeholder={t("auth.login.password")}
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
            editable={!login.isPending}
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: COLORS.black,
                    },
                  ]}
                >
                  {t("auth.login.rememberMe")}
                </Text>
              </View>
            </View>
          </View>
          <Button
            title={
              login.isPending
                ? t("auth.login.loggingIn")
                : t("auth.login.loginButton")
            }
            filled
            onPress={handleLogin}
            disabled={login.isPending}
            style={[
              styles.button,
              {
                borderColor:
                  login.isPending || !formState.formIsValid
                    ? COLORS.lightGreen
                    : COLORS.primary,
                backgroundColor:
                  login.isPending || !formState.formIsValid
                    ? COLORS.lightGreen
                    : COLORS.primary,
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => navigate("forgotpasswordmethods")}
            disabled={login.isPending}
          >
            <Text
              style={[
                styles.forgotPasswordBtnText,
                login.isPending && styles.disabledText,
              ]}
            >
              {t("auth.login.forgotPassword")}
            </Text>
          </TouchableOpacity>
          <View>
            {/* <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                onPress={handleAppleAuth}
                tintColor={COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={handleFacebookAuth}
              />
              <SocialButton
                icon={icons.google}
                onPress={handleGoogleAuth}
              />
            </View> */}
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text
            style={[
              styles.bottomLeft,
              {
                color: COLORS.black,
              },
            ]}
          >
            {t("auth.login.noAccount")}
          </Text>
          <TouchableOpacity onPress={() => navigate("signup")}>
            <Text style={styles.bottomRight}>
              {"  "}
              {t("auth.login.signUp")}
            </Text>
          </TouchableOpacity>
        </View>
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
      marginVertical: 32,
    },
    title: {
      fontSize: 20,
      fontFamily: "bold",
      color: COLORS.black,
      textAlign: "center",
      marginBottom: 16,
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
      marginHorizontal: 4,
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
      position: "absolute",
      bottom: 12,
      right: 0,
      left: 0,
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
    forgotPasswordBtnText: {
      fontSize: 16,
      fontFamily: "semiBold",
      color: COLORS.primary,
      textAlign: "center",
      marginTop: 12,
    },
    disabledText: {
      opacity: 0.5,
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
    errorText: {
      fontSize: 14,
      fontFamily: "medium",
      color: COLORS.red,
    },
  });

export default Login;

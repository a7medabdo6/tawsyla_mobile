import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { useRegister } from '@/data';
import { useLanguageContext } from '@/contexts/LanguageContext';

interface InputValues {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phoneNumber: string
}

interface InputValidities {
  email: boolean | undefined
  password: boolean | undefined
  confirmPassword: boolean | undefined
  fullName: boolean | undefined
  phoneNumber: boolean | undefined
}

interface FormState {
  inputValues: InputValues
  inputValidities: InputValidities
  formIsValid: boolean
}

const initialState: FormState = {
  inputValues: {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  },
  inputValidities: {
    email: false,
    password: false,
    confirmPassword: false,
    fullName: false,
    phoneNumber: false,
  },
  formIsValid: false,
}

type Nav = {
  navigate: (value: string) => void
}

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
      const result = validateInput(inputId, inputValue)
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      })
    },
    [dispatchFormState])

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error])

  // Handle registration success and error
  useEffect(() => {
    if (register.isSuccess) {
      // Navigate to main app on successful registration
      navigate("(tabs)");
    }
  }, [register.isSuccess, navigate]);

  useEffect(() => {
    if (register.error) {
      Alert.alert('Registration Failed', register.error.message || 'An error occurred during registration');
    }
  }, [register.error]);

  // implementing apple authentication
  const appleAuthHandler = () => {
    console.log("Apple Authentication")
  };

  // implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log("Facebook Authentication")
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log("Google Authentication")
  };

  // Handle registration form submission
  const handleRegister = () => {
    if (!formState.formIsValid) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    if (!isChecked) {
      Alert.alert('Terms Required', 'Please accept the Privacy Policy to continue');
      return;
    }

    if (formState.inputValues.password !== formState.inputValues.confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and Confirm Password must match');
      return;
    }

    // Split full name into first and last name
    const nameParts = formState.inputValues.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    register.mutate({
      email: formState.inputValues.email,
      password: formState.inputValues.password,
      confirmPassword: formState.inputValues.confirmPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: formState.inputValues.phoneNumber
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
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              contentFit='contain'
              style={styles.logo}
            />
          </View>
          <Text style={[styles.title, {
            color: COLORS.black
          }]}>{t('auth.signup.title')}</Text>
          
          {register.isPending && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('auth.signup.creatingAccount')}</Text>
            </View>
          )}
          
          <Input
            id="fullName"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['fullName']}
            placeholder={t('auth.signup.fullName')}
            placeholderTextColor={COLORS.black}
            icon={icons.user}
            autoCapitalize="words"
            editable={!register.isPending}
          />
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            placeholder={t('auth.signup.email')}
            placeholderTextColor={COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
            editable={!register.isPending}
          />
          <Input
            id="phoneNumber"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['phoneNumber']}
            placeholder={t('auth.signup.phoneNumber')}
            placeholderTextColor={COLORS.black}
            icon={icons.call}
            keyboardType="phone-pad"
            editable={!register.isPending}
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder={t('auth.signup.password')}
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
            editable={!register.isPending}
          />
          <Input
            id="confirmPassword"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['confirmPassword']}
            autoCapitalize="none"
            placeholder={t('auth.signup.confirmPassword')}
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
            editable={!register.isPending}
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.privacy, {
                  color: COLORS.black
                }]}>{t('auth.signup.privacyPolicy')}</Text>
              </View>
            </View>
          </View>
          <Button
            title={register.isPending ? t('auth.signup.creatingAccount') : t('auth.signup.signUpButton')}
            filled
            onPress={handleRegister}
            style={styles.button}
            disabled={register.isPending}
          />
          <View style={styles.bottomContainer}>
          <Text style={[styles.bottomLeft, {
            color: COLORS.black
          }]}>{t('auth.signup.hasAccount')}</Text>
          <TouchableOpacity
            onPress={() => navigate("login")}
            disabled={register.isPending}>
            <Text style={[styles.bottomRight, register.isPending && styles.disabledText]}>
              {" "}{t('auth.signup.signIn')}
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
       
      </View>
    </SafeAreaView>
  )
};

const createStyles = (isRTL: boolean) => StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: isRTL ? "right" : "center",
    marginBottom: 12
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginVertical: 26
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
    color: "black"
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 8
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.primary
  },
  disabledText: {
    opacity: 0.5
  }
})

export default Signup
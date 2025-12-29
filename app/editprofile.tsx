import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { COLORS, SIZES, icons, images } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { launchImagePicker } from "../utils/ImagePickerHelper";
import Input from "../components/Input";
import Button from "../components/Button";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { useUpdateProfile, useAuthStatus } from "@/data";
import { useLanguageContext } from "@/contexts/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t, isRTL } = useLanguageContext();
  const { data: authData } = useAuthStatus();
  const updateProfile = useUpdateProfile();

  const [image, setImage] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Form state for profile fields
  const [profileFormState, dispatchProfileForm] = useReducer(reducer, {
    inputValues: {
      firstName: "",
      email: "",
      phone: "",
    },
    inputValidities: {
      firstName: false,
      email: false,
      phone: false,
    },
    formIsValid: false,
  });

  // Form state for password change
  const [passwordFormState, dispatchPasswordForm] = useReducer(reducer, {
    inputValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    inputValidities: {
      oldPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    },
    formIsValid: false,
  });

  // Load user data from AsyncStorage
  const loadUserDataFromStorage = useCallback(async () => {
    setIsLoadingUserData(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);

        // Update profile form with stored user data
        dispatchProfileForm({
          inputId: "firstName",
          validationResult: undefined,
          inputValue: user.firstName || "",
        });

        dispatchProfileForm({
          inputId: "phone",
          validationResult: undefined,
          inputValue: user.phone || "",
        });
        dispatchProfileForm({
          inputId: "email",
          validationResult: undefined,
          inputValue: user.email || "",
        });
      } else {
        // Fallback to authData if AsyncStorage is empty
        if (authData?.user) {
          dispatchProfileForm({
            inputId: "firstName",
            validationResult: undefined,
            inputValue: authData.user.firstName || "",
          });
          dispatchProfileForm({
            inputId: "phone",
            validationResult: undefined,
            inputValue: authData.user.phone || "",
          });
          dispatchProfileForm({
            inputId: "email",
            validationResult: undefined,
            inputValue: authData.user.email || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading user data from AsyncStorage:", error);

      // Fallback to authData on error
      if (authData?.user) {
        dispatchProfileForm({
          inputId: "firstName",
          validationResult: undefined,
          inputValue: authData.user.firstName || "",
        });
        dispatchProfileForm({
          inputId: "phone",
          validationResult: undefined,
          inputValue: authData.user.phone || "",
        });
        dispatchProfileForm({
          inputId: "email",
          validationResult: undefined,
          inputValue: authData.user.email || "",
        });
      }
    } finally {
      setIsLoadingUserData(false);
    }
  }, [authData]);

  // Refresh user data
  const refreshUserData = useCallback(() => {
    loadUserDataFromStorage();
  }, [loadUserDataFromStorage]);

  // Refresh form data after successful update
  const refreshFormData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);

        // Update profile form with latest user data
        dispatchProfileForm({
          inputId: "firstName",
          validationResult: undefined,
          inputValue: user.firstName || "",
        });

        dispatchProfileForm({
          inputId: "email",
          validationResult: undefined,
          inputValue: user.email || "",
        });

        // console.log("Form data refreshed with updated values:", user);
      }
    } catch (error) {
      // console.error("Error refreshing form data:", error);
    }
  }, []);

  // Validate AsyncStorage update
  const validateAsyncStorageUpdate = useCallback(async (expectedData: any) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const storedUser = JSON.parse(userData);
        const isUpdated = Object.keys(expectedData).every(
          (key) => storedUser[key] === expectedData[key]
        );

        if (isUpdated) {
          // console.log("AsyncStorage updated successfully with:", expectedData);
          return true;
        } else {
          // console.warn("AsyncStorage update validation failed");
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Error validating AsyncStorage update:", error);
      return false;
    }
  }, []);

  // Load user data when component mounts
  useEffect(() => {
    loadUserDataFromStorage();
  }, [loadUserDataFromStorage]);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchProfileForm({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchProfileForm]
  );

  const passwordInputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      let result;

      if (inputId === "confirmNewPassword") {
        // Pass the current newPassword value for confirmNewPassword validation
        result = validateInput(
          inputId,
          inputValue,
          passwordFormState.inputValues.newPassword
        );
      } else {
        result = validateInput(inputId, inputValue);
      }

      dispatchPasswordForm({
        inputId,
        validationResult: result,
        inputValue,
      });

      // If this is a newPassword change, also re-validate confirmNewPassword
      if (
        inputId === "newPassword" &&
        passwordFormState.inputValues.confirmNewPassword
      ) {
        const confirmPasswordResult = validateInput(
          "confirmNewPassword",
          passwordFormState.inputValues.confirmNewPassword,
          inputValue
        );
        dispatchPasswordForm({
          inputId: "confirmNewPassword",
          validationResult: confirmPasswordResult,
          inputValue: passwordFormState.inputValues.confirmNewPassword,
        });
      }
    },
    [
      dispatchPasswordForm,
      passwordFormState.inputValues.newPassword,
      passwordFormState.inputValues.confirmNewPassword,
    ]
  );

  useEffect(() => {
    if (updateProfile.isSuccess) {
      // Refresh form data to show updated values
      refreshFormData();

      // Show success message
      Alert.alert(t("editProfile.success"), t("editProfile.updateSuccess"), [
        {
          text: "OK",
          onPress: () => {
            // Navigate back after user acknowledges the success
            navigation.goBack();
          },
        },
      ]);
    }
  }, [updateProfile.isSuccess, navigation, t, refreshFormData]);

  useEffect(() => {
    if (updateProfile.error) {
      Alert.alert(t("editProfile.error"), t("editProfile.updateError"));
    }
  }, [updateProfile.error, t]);

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setImage({ uri: tempUri });
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileFormState.formIsValid) {
      Alert.alert(
        t("editProfile.validationError"),
        t("editProfile.validationErrorMessage")
      );
      return;
    }

    try {
      // Get current user data from AsyncStorage for comparison
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        Alert.alert(t("editProfile.error"), "User data not found");
        return;
      }

      const currentUser = JSON.parse(userData);
      const updateData: any = {};

      if (profileFormState.inputValues.firstName !== currentUser.firstName) {
        updateData.firstName = profileFormState.inputValues.firstName;
      }

      if (profileFormState.inputValues.phone !== currentUser.phone) {
        updateData.phone = profileFormState.inputValues.phone;
      }
      if (profileFormState.inputValues.email !== currentUser.email) {
        updateData.email = profileFormState.inputValues.email;
      }

      if (Object.keys(updateData).length > 0) {
        // Store the updated data to update AsyncStorage after successful API call
        const updatedUserData = {
          ...currentUser,
          ...updateData,
        };

        // Update profile via API
        updateProfile.mutate(updateData, {
          onSuccess: async () => {
            try {
              // Update AsyncStorage with new user data
              await AsyncStorage.setItem(
                "user",
                JSON.stringify(updatedUserData)
              );
              // console.log(
              //   "Updated user data in AsyncStorage:",
              //   updatedUserData
              // );

              // Validate the update
              const isValid = await validateAsyncStorageUpdate(updateData);
              if (!isValid) {
                console.warn(
                  "AsyncStorage update validation failed, attempting to refresh"
                );
                // Try to refresh from storage as fallback
                await refreshUserData();
              }
            } catch (storageError) {
              console.error("Error updating AsyncStorage:", storageError);
              // Try to refresh from storage as fallback
              await refreshUserData();
            }
          },
        });
      } else {
        Alert.alert(
          t("editProfile.noChanges"),
          t("editProfile.noChangesMessage")
        );
      }
    } catch (error) {
      console.error("Error checking user data:", error);
      Alert.alert(t("editProfile.error"), "Failed to check current user data");
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordFormState.formIsValid) {
      Alert.alert(
        t("editProfile.passwordValidationError"),
        t("editProfile.passwordValidationErrorMessage")
      );
      return;
    }

    if (
      passwordFormState.inputValues.newPassword !==
      passwordFormState.inputValues.confirmNewPassword
    ) {
      Alert.alert("Password Mismatch", t("editProfile.passwordMismatch"));
      return;
    }

    const updateData = {
      oldPassword: passwordFormState.inputValues.oldPassword,
      password: passwordFormState.inputValues.newPassword,
    };

    // Update password via API
    updateProfile.mutate(updateData, {
      onSuccess: async () => {
        try {
          // Get current user data from AsyncStorage
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            const currentUser = JSON.parse(userData);

            // If the API response includes updated user data, update AsyncStorage
            // This depends on your API response structure
            // For now, we'll just log that password was updated
            // console.log("Password updated successfully");

            // Clear password form
            dispatchPasswordForm({
              inputId: "oldPassword",
              validationResult: undefined,
              inputValue: "",
            });

            dispatchPasswordForm({
              inputId: "newPassword",
              validationResult: undefined,
              inputValue: "",
            });

            dispatchPasswordForm({
              inputId: "confirmNewPassword",
              validationResult: undefined,
              inputValue: "",
            });

            // Show success message
            Alert.alert(
              t("editProfile.success"),
              t("editProfile.passwordUpdated")
            );
          }
        } catch (storageError) {
          console.error(
            "Error handling password update success:",
            storageError
          );
        }
      },
    });

    setShowPasswordModal(false);
  };

  // Password change modal
  function PasswordChangeModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPasswordModal}
      >
        <TouchableWithoutFeedback onPress={() => setShowPasswordModal(false)}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: SIZES.width * 0.9,
                backgroundColor: COLORS.white,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {t("editProfile.changePassword")}
              </Text>

              <Input
                id="oldPassword"
                onInputChanged={passwordInputChangedHandler}
                errorText={passwordFormState.inputValidities["oldPassword"]}
                placeholder={t("editProfile.currentPassword")}
                placeholderTextColor={COLORS.black}
                icon={icons.padlock}
                secureTextEntry={true}
              />

              <Input
                id="newPassword"
                onInputChanged={passwordInputChangedHandler}
                errorText={passwordFormState.inputValidities["newPassword"]}
                placeholder={t("editProfile.newPassword")}
                placeholderTextColor={COLORS.black}
                icon={icons.padlock}
                secureTextEntry={true}
              />

              <Input
                id="confirmNewPassword"
                onInputChanged={passwordInputChangedHandler}
                errorText={
                  passwordFormState.inputValidities["confirmNewPassword"]
                }
                placeholder={t("editProfile.confirmNewPassword")}
                placeholderTextColor={COLORS.black}
                icon={icons.padlock}
                secureTextEntry={true}
              />

              <View style={styles.modalButtons}>
                <Button
                  title={t("editProfile.cancel")}
                  onPress={() => setShowPasswordModal(false)}
                  style={[styles.modalButton, styles.cancelButton]}
                />
                <Button
                  title={
                    updateProfile.isPending
                      ? t("editProfile.updating")
                      : t("editProfile.updateButton")
                  }
                  filled
                  onPress={handleUpdatePassword}
                  style={styles.modalButton}
                  disabled={updateProfile.isPending}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View
        style={{
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <Header title={t("editProfile.personalProfile")} />
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
        {/* Refresh button */}
        {/* <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshUserData}
          disabled={isLoadingUserData}
        >
          <Text style={styles.refreshButtonText}>
            {isLoadingUserData ? t("common.loading") : t("common.refreshData")}
          </Text>
        </TouchableOpacity> */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? images.user1 : image}
                contentFit="cover"
                style={styles.avatar}
              />
              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Input
              id="firstName"
              onInputChanged={inputChangedHandler}
              errorText={profileFormState.inputValidities["firstName"]}
              placeholder={t("editProfile.firstName")}
              placeholderTextColor={COLORS.black}
              editable={!isLoadingUserData}
              value={profileFormState.inputValues.firstName}
            />

            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              errorText={profileFormState.inputValidities["email"]}
              placeholder={t("editProfile.email")}
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              value={profileFormState.inputValues.email}
              editable={!isLoadingUserData}
            />

            <Input
              id="phone"
              onInputChanged={inputChangedHandler}
              errorText={profileFormState.inputValidities["phone"]}
              placeholder={t("editProfile.phone")}
              placeholderTextColor={COLORS.black}
              value={profileFormState.inputValues.phone}
              editable={!isLoadingUserData}
            />

            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => setShowPasswordModal(true)}
              disabled={isLoadingUserData}
            >
              <Text style={styles.changePasswordText}>
                {t("editProfile.changePassword")}
              </Text>
            </TouchableOpacity>

            {isLoadingUserData && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                  {t("common.loadingUserData")}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {PasswordChangeModal()}

      <View style={styles.bottomContainer}>
        <Button
          title={
            updateProfile.isPending
              ? t("editProfile.updating")
              : t("editProfile.updateButton")
          }
          filled
          style={styles.continueButton}
          onPress={handleUpdateProfile}
          disabled={updateProfile.isPending}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  changePasswordButton: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderColor: COLORS.primary,
  },
  changePasswordText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.greyscale500,
    borderColor: COLORS.greyscale500,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 100,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  loadingContainer: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.grayscale100,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
  },
  loadingText: {
    color: COLORS.greyscale500,
    fontSize: 14,
  },
  refreshButton: {
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.grayscale100,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
  },
  refreshButtonText: {
    color: COLORS.greyscale500,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default EditProfile;

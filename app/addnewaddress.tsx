import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, {
  useRef,
  useEffect,
  useReducer,
  useCallback,
  useState,
} from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, SIZES, COLORS, FONTS } from "../constants";
import RBSheet from "react-native-raw-bottom-sheet";
import { commonStyles } from "../styles/CommonStyles";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import Button from "../components/Button";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { NavigationProp } from "@react-navigation/native";
import { mapStandardStyle } from "@/data/mapData";
import {
  useAddAddress,
  useGetOneAddress,
  useUpdateAddress,
} from "@/data/useAddress";
import Header from "@/components/Header";
import { useLanguageContext } from "@/contexts/LanguageContext";
import Checkbox from "expo-checkbox";
import { useAuthStatus } from "@/data";

const initialState = {
  inputValues: {
    city: "",
    state: "",
    additionalInfo: "",
    phone: "",
  },
  inputValidities: {
    city: false,
    state: false,
    additionalInfo: false,
    phone: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const AddNewAddress = () => {
  const { navigate } = useNavigation<Nav>();
  const navigation = useNavigation<NavigationProp<any>>();
  const bottomSheetRef = useRef<any>(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const { mutate, isPending } = useAddAddress();

  const { mutate: updateAddress } = useUpdateAddress();

  const { t, isRTL } = useLanguageContext();
  const [isChecked, setChecked] = useState(false);
  const params = useLocalSearchParams();

  const addressId = params.id as string;
  const totalPrice = params.totalPrice as string;

  const { data: address } = useGetOneAddress(addressId);

  useEffect(() => {
    if (address) {
      setChecked(address?.isDefault);
      // Update profile form with stored user data
      dispatchFormState({
        inputId: "city",
        validationResult: undefined,
        inputValue: address.city || "",
      });
      dispatchFormState({
        inputId: "state",
        validationResult: undefined,
        inputValue: address.state || "",
      });
      dispatchFormState({
        inputId: "phone",
        validationResult: undefined,
        inputValue: address.phone || "",
      });
      dispatchFormState({
        inputId: "additionalInfo",
        validationResult: undefined,
        inputValue: address.additionalInfo || "",
      });
    }
  }, [address]);
  const handleCreateAddress = async () => {
    if (address) {
      updateAddress(
        { ...formState.inputValues, isDefault: isChecked, id: addressId },
        {
          onSuccess: async () => {
            try {
              // Update AsyncStorage with new user data
              navigate("address");
            } catch (err) {
              console.error("Error adding address:", err);
              // Try to refresh from storage as fallback
            }
          },
        }
      );
    } else {
      mutate(
        { ...formState.inputValues, isDefault: isChecked },
        {
          onSuccess: async () => {
            try {
              // Update AsyncStorage with new user data
              if(params.returnTo === "checkout"){
                navigation.navigate("checkout",{totalPrice});
              }else{
                navigation.navigate("address");
              }
            } catch (err) {
              console.error("Error adding address:", err);
              // Try to refresh from storage as fallback
            }
          },
        }
      );
    }
  };

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

  // Open the bottom sheet on component mount
  // useEffect(() => {
  //   bottomSheetRef.current.open()
  // }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <StatusBar hidden={true} />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title={address ? t("Edit Address") : t("Add New Address")} />
        {/* 
      <View
        style={{
          position: 'absolute',
          marginHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          top: 22,
          zIndex: 999,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 45,
            width: 45,
            borderRadius: 22.5,
            backgroundColor: COLORS.black,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            zIndex: 9999,
          }}>
          <Image
            source={icons.arrowLeft}
            contentFit="contain"
            style={{
              height: 24,
              width: 24,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
        <Text style={{ ...FONTS.body3 }}>Add New Address</Text>
      </View> */}
        {/* <MapView
        style={styles.map}
        customMapStyle={mapStandardStyle}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: 48.8566,
            longitude: 2.3522,
          }}
          image={icons.mapLocation}
          title="Move"
          description="Address"
          onPress={() => console.log('Move to another screen')}>
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text
                  style={{
                    ...FONTS.body4,
                    fontWeight: 'bold',
                    color: COLORS.black,
                  }}>
                  User Address
                </Text>
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>
      </MapView> */}
        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View>
             
              <View
                style={{
                  marginTop: 0,
                  width: SIZES.width - 32,
                }}
              >
                <Text
                  style={[
                    commonStyles.inputHeader,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}
                >
                  {t("city")}
                </Text>
                <Input
                  id="city"
                  value={formState.inputValues.city}
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities["city"]}
                  placeholder="اسيوط الجديدة"
                  placeholderTextColor={COLORS.black}
                />
              </View>

              <View style={{ marginTop: 12 }}>
                <Text
                  style={[
                    commonStyles.inputHeader,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}
                >
                  {t("state")}
                </Text>
                <Input
                  id="state"
                  value={formState.inputValues.state}
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities["state"]}
                  placeholder="حي رجال  الاعمال"
                  placeholderTextColor={COLORS.black}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <Text
                  style={[
                    commonStyles.inputHeader,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}
                >
                  {t("additionalInfo")}
                </Text>
                <Input
                  value={formState.inputValues.additionalInfo}
                  id="additionalInfo"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities["additionalInfo"]}
                  placeholder="ابني بيتك بجوار مسجد الرحمن"
                  placeholderTextColor={COLORS.black}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <Text
                  style={[
                    commonStyles.inputHeader,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}
                >
                  {t("phone")}
                </Text>
                <Input
                  value={formState.inputValues.phone}
                  id="phone"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities["phone"]}
                  placeholder="+2001159360628"
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 13,
                alignItems: "center",
              }}
            >
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>{t("setAsDefault")}</Text>
            </View>
            <Button
              filled
              title={t("SAVE LOCATION")}
              onPress={() => {
                handleCreateAddress();
              }}
              disabled={!formState?.formIsValid}
              style={[
                {
                  borderRadius: 30,
                  borderColor:
                    isPending || !formState.formIsValid
                      ? COLORS.lightGreen
                      : COLORS.primary,
                  backgroundColor:
                    isPending || !formState.formIsValid
                      ? COLORS.lightGreen
                      : COLORS.primary,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    height: "100%",
    zIndex: 1,
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  // Callout bubble
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: "auto",
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  body3: {
    fontSize: 12,
    color: COLORS.grayscale700,
    marginVertical: 3,
  },
  h3: {
    fontSize: 12,
    color: COLORS.grayscale700,
    marginVertical: 3,
    fontFamily: "bold",
    marginRight: 6,
  },
  btn1: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btn2: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: COLORS.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.5)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginBottom: 12,
  },
  roundedCheckBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.gray,
    marginRight: 12,
  },
  selectedCheckbox: {
    backgroundColor: COLORS.primary,
  },
  checkboxText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "regular",
  },
  starContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
});

export default AddNewAddress;

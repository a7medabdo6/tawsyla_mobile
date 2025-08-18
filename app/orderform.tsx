import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, ImageSourcePropType } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import { reducer } from '../utils/reducers/formReducers';
import Button from '../components/Button';
import InputLabel from '@/components/InputLabel';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const isTestMode = true

const initialState = {
    inputValues: {
        fullName: isTestMode ? 'fullName' : '',
        phoneNumber: isTestMode ? 'phoneMumber' : '',
        city: isTestMode ? '1254 Kanata, Ottawa' : '',
        detailLocation: isTestMode ? "121 Pike St, Marietta, OH, Green House with Big tree in the hall" : ""
    },
    inputValidities: {
        fullName: false,
        phoneNumber: false,
        city: false,
        detailLocation: false
    },
    formIsValid: false,
}

const OrderForm = () => {
    /**
     * Render header
     */
    const renderHeader = () => {
        const navigation = useNavigation<NavigationProp<any>>();

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.headerIconContainer, { 
                        borderColor: COLORS.grayscale200
                    }]}>
                    <Image
                        source={icons.arrowLeft as ImageSourcePropType}
                        resizeMode='contain'
                        style={[styles.arrowBackIcon, { 
                            tintColor: COLORS.black
                        }]}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { 
                    color: COLORS.black
                }]}>Sender Details</Text>
                <TouchableOpacity>
                    <Feather name="more-vertical" size={24} color={"black"} />
                </TouchableOpacity>
            </View>
        )
    }
    /**
     * Render content
     */
    const renderContent = () => {
        const navigation = useNavigation<NavigationProp<any>>();
        const [formState, dispatchFormState] = useReducer(reducer, initialState)
        const [isLoading, setIsLoading] = useState(false)
        const [error, setError] = useState(null)

        const inputChangedHandler = useCallback(
            (inputId: string, inputValue: string) => {
              const result = validateInput(inputId, inputValue)
              dispatchFormState({
                inputId,
                validationResult: result,
                inputValue,
              })
            }, [dispatchFormState])

        useEffect(() => {
            if (error) {
                Alert.alert('An error occured', error)
            }
        }, [error])

        return (
            <View>
                <InputLabel title="Full Name" />
                <Input
                    id="fullName"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities['fullName']}
                    placeholder="Full Name"
                    placeholderTextColor={COLORS.black}
                />
                <InputLabel title="Phone Number" />
                <Input
                    id="phoneNumber"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities['phoneNumber']}
                    placeholder="Phone Number"
                    placeholderTextColor={COLORS.black}
                />
                <InputLabel title="City / Province" />
                <Input
                    id="city"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities['city']}
                    placeholder="City / Province"
                    placeholderTextColor={COLORS.black}
                />
                <InputLabel title="Detail Location" />
                <Input
                    id="detailLocation"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities['detailLocation']}
                    placeholder="121 Pike St, Marietta, OH, Green House with Big tree in the hall"
                    placeholderTextColor={COLORS.black}
                />
                <Button
                title="Continue"
                filled
                style={styles.continueBtn}
                onPress={()=>navigation.navigate("orderdetails")}/>
            </View>
        )
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    headerIconContainer: {
        height: 46,
        width: 46,
        borderWidth: 1,
        borderColor: COLORS.grayscale200,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999
    },
    arrowBackIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.black
    },
    continueBtn: {
        borderRadius: 30,
        marginVertical: 22,
        width: SIZES.width - 32
    }
})

export default OrderForm
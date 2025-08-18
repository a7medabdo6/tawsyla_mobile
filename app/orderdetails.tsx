import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ImageSourcePropType } from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import InputLabel from '../components/InputLabel';
import Button from "../components/Button";
import RBSheet from 'react-native-raw-bottom-sheet';
import ServiceItem from '@/components/ServiceItem';
import PaymentItem from '@/components/PaymentItem';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const OrderDetails = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const servicesBottomSheet = useRef<any>(null);
    const paymentMethodBottomSheet = useRef<any>(null);
    const successBottomSheet = useRef<any>(null);
    const [selectedPackage, setSelectedPackage] = useState('Select Services');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
    /**
    * render header
    */
    const renderHeader = () => {
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
                }]}>Order Details</Text>
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
        return (
            <View>
                <View style={styles.inputContainer}>
                    <View style={styles.inputLeft}>
                        <InputLabel title="Full Name" />
                        <View style={[styles.fullNameInput, { 
                            backgroundColor: COLORS.secondaryWhite,
                        }]}>
                            <Image
                                source={icons.box2}
                                resizeMode='contain'
                                style={styles.boxIcon}
                            />
                            <TextInput
                                placeholder='Enter package type'
                                placeholderTextColor={COLORS.gray}
                                style={styles.packageTypeInput}
                            />
                        </View>
                    </View>
                    <View style={styles.inputRight}>
                        <InputLabel title="Weight" />
                        <View style={[styles.weightInput, { 
                            backgroundColor: COLORS.secondaryWhite
                        }]}>
                            <TextInput
                                placeholder="0"
                                placeholderTextColor={COLORS.gray}
                                style={[styles.weightInputName, { 
                                    backgroundColor: COLORS.secondaryWhite,
                                }]}
                            />
                            <Text style={styles.weightText}>Kg</Text>
                        </View>
                    </View>
                </View>
                <InputLabel title="Dimensions" />
                <View style={styles.dimensionContainer}>
                    <View style={[styles.dimensionInputContainer, { 
                        backgroundColor: COLORS.secondaryWhite,
                    }]}>
                        <TextInput
                            placeholder='Length'
                            placeholderTextColor={COLORS.gray}
                            style={styles.dimensionInput}
                            keyboardType="numeric"
                        />
                        <Text style={[styles.dimensionText, { 
                            color: COLORS.black
                        }]}>Cm</Text>
                    </View>
                    <View style={[styles.dimensionInputContainer, { 
                        backgroundColor: COLORS.secondaryWhite,
                    }]}>
                        <TextInput
                            placeholder='Weight'
                            placeholderTextColor={COLORS.gray}
                            style={styles.dimensionInput}
                            keyboardType="numeric"
                        />
                        <Text style={[styles.dimensionText, {
                            color: COLORS.black
                        }]}>Cm</Text>
                    </View>
                    <View style={[styles.dimensionInputContainer, { 
                        backgroundColor: COLORS.secondaryWhite,
                    }]}>
                        <TextInput
                            placeholder='Height'
                            placeholderTextColor={COLORS.gray}
                            style={styles.dimensionInput}
                            keyboardType="numeric"
                        />
                        <Text style={[styles.dimensionText, { 
                            color: COLORS.black
                        }]}>Cm</Text>
                    </View>
                </View>
                <InputLabel title="Services" />
                <TouchableOpacity
                    onPress={() => servicesBottomSheet.current.open()}
                    style={[styles.servicesContainer, { 
                        backgroundColor: COLORS.secondaryWhite,
                    }]}>
                    <View style={styles.servicesLeft}>
                        <Ionicons name="document-text-outline" size={24} color={COLORS.gray} />
                        <Text style={styles.serviceTitle}>{selectedPackage}</Text>
                    </View>
                    <SimpleLineIcons name="arrow-down" size={20} color={COLORS.gray} />
                </TouchableOpacity>
                <View style={styles.disclaimerContainer}>
                    <MaterialCommunityIcons name="information" size={24} color={COLORS.primary} />
                    <View style={styles.disclaimerView}>
                        <Text style={styles.disclaimerTitle}>Weight discrepancies will incur additional
                            fees or the goods will be returned</Text>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView>
                    {renderContent()}
                </ScrollView>
            </View>
            <Button
                title="Pay Now"
                filled
                style={styles.button}
                onPress={() => paymentMethodBottomSheet.current.open()}
            />
            <RBSheet
                ref={servicesBottomSheet}
                height={360}
                openDuration={250}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,.2)",
                    },
                    draggableIcon: {
                        backgroundColor: COLORS.gray,
                        width: 100
                    },
                    container: {
                        backgroundColor: COLORS.white
                    }
                }}>
                <View style={{
                    width: SIZES.width - 32,
                    marginHorizontal: 16,
                    flexDirection: 'column',
                    marginVertical: 22,
                    backgroundColor: COLORS.white
                }}>
                    <Text style={[styles.serviceSubtitle, { 
                        color: COLORS.gray
                    }]}>Services</Text>
                    <View style={{ marginVertical: 22 }}>
                        <ServiceItem
                            pkgIcon={icons.package2}
                            title="Regular"
                            duration="2 - 3 Days"
                            price="$15"
                            isSelected={selectedPackage === 'Regular'}
                            onSelect={() => setSelectedPackage('Regular')}
                            onPress={() => {
                                servicesBottomSheet.current.close();
                            }}
                        />
                        <ServiceItem
                            pkgIcon={icons.package2}
                            title="Cargo"
                            duration="3 - 6 Days"
                            price="$31"
                            isSelected={selectedPackage === 'Cargo'}
                            onSelect={() => setSelectedPackage('Cargo')}
                            onPress={() => {
                                servicesBottomSheet.current.close()
                            }}
                        />
                        <ServiceItem
                            pkgIcon={icons.cargo}
                            title="Express"
                            duration="1 - 2 Days"
                            price="$42"
                            isSelected={selectedPackage === 'Express'}
                            onSelect={() => setSelectedPackage('Express')}
                            onPress={() => {
                                servicesBottomSheet.current.close()
                            }}
                        />
                    </View>
                </View>
            </RBSheet>
            <RBSheet
                ref={paymentMethodBottomSheet}
                height={380}
                openDuration={250}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,.2)",
                    },
                    draggableIcon: {
                        backgroundColor: COLORS.gray,
                        width: 100
                    },
                    container: {
                        backgroundColor: COLORS.white
                    }
                }}>
                <View style={{
                    width: SIZES.width - 32,
                    marginHorizontal: 16,
                    flexDirection: 'column',
                    marginVertical: 22,
                    backgroundColor: COLORS.white
                }}>
                    <Text style={[styles.serviceSubtitle, { 
                        color: COLORS.gray
                    }]}>Payment Method</Text>
                    <View style={{ marginVertical: 22 }}>
                        <PaymentItem
                            title="Tracky Balance"
                            number="$4.875.00"
                            icon={icons.balance2}
                            checked={selectedPaymentMethod === 'Tracky Balance'}
                            onSelect={() => setSelectedPaymentMethod('Tracky Balance')}
                            onPress={() => { return null }}
                        />
                        <PaymentItem
                            title="Mastercard"
                            number="6895 3526 8456 ****"
                            icon={icons.mastercard2}
                            checked={selectedPaymentMethod === 'Mastercard'}
                            onSelect={() => setSelectedPaymentMethod('Mastercard')}
                            onPress={() => { return null }}
                        />
                        <Button
                            title="Confirm Payment"
                            filled
                            style={styles.paymentBtn}
                            onPress={() => {
                                try {
                                    if (paymentMethodBottomSheet.current && successBottomSheet.current) {
                                        // Close the bottom sheet after 0 milliseconds
                                        paymentMethodBottomSheet.current.close();

                                        // Wait for 3 seconds before opening the success sheet
                                        setTimeout(() => {
                                            successBottomSheet.current.open();
                                        }, 3000);
                                    } else {
                                        console.error("PaymentMethodBottomSheet or SuccessBottomSheet is not properly defined.");
                                    }
                                } catch (error) {
                                    console.error("Error:", error);
                                }
                            }}
                        />
                    </View>
                </View>
            </RBSheet>
            <RBSheet
                ref={successBottomSheet}
                height={540}
                openDuration={250}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,.2)",
                    },
                    draggableIcon: {
                        backgroundColor: COLORS.gray,
                        width: 100
                    },
                    container: {
                        backgroundColor: COLORS.white
                    }
                }}>
                <View style={{
                    width: SIZES.width - 32,
                    marginHorizontal: 16,
                    flexDirection: 'column',
                    marginVertical: 22,
                    alignItems: "center",
                    backgroundColor: COLORS.white
                }}>
                    <Image
                        source={images.orderSuccess}
                        resizeMode='contain'
                        style={styles.orderSuccess}
                    />
                    <View style={[styles.orderView, { 
                        backgroundColor: COLORS.white
                    }]}>
                        <Text style={[styles.orderTitle, { 
                            color: COLORS.black,
                        }]}>Order Successfully</Text>
                        <Text style={styles.orderSubtitle}>Congratulation! your package will be picked up by the courier, please wait a moment.</Text>
                        <Button
                            title="Go To Homepage"
                            filled
                            style={styles.homeBtn}
                            onPress={() => navigation.navigate("(tabs)")}
                        />
                    </View>
                </View>
            </RBSheet>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
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
        marginVertical: 32,
        position: "absolute",
        bottom: 0,
        right: 16,
        left: 16,
        width: SIZES.width - 32
    },
    inputContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        flex: 1
    },
    fullNameInput: {
        height: 48,
        backgroundColor: COLORS.secondaryWhite,
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 8,
        width: (SIZES.width - 32) * 3 / 5,
        borderRadius: 12,
        marginRight: 12
    },
    boxIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.gray
    },
    packageTypeInput: {
        paddingHorizontal: 12
    },
    weightInput: {
        height: 48,
        backgroundColor: COLORS.secondaryWhite,
        width: SIZES.width - ((SIZES.width - 32) * 3 / 5) - 12,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: 'center'
    },
    weightInputName: {
        backgroundColor: COLORS.secondaryWhite,
        paddingHorizontal: 12
    },
    dimensionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: SIZES.width - 32
    },
    dimensionInputContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.secondaryWhite,
        width: (SIZES.width - 44) / 3,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        paddingRight: 6
    },
    dimensionInput: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 12,
        color: COLORS.black,
        fontFamily: "regular"
    },
    dimensionText: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.black
    },
    servicesContainer: {
        height: 48,
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        borderRadius: 12,
        flexDirection: "row",
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "space-between"
    },
    notesIcon: {
        width: 24,
        height: 24
    },
    servicesLeft: {
        flexDirection: "row",
        alignItems: 'center'
    },
    serviceTitle: {
        fontSize: 14,
        color: COLORS.gray,
        paddingHorizontal: 8
    },
    disclaimerContainer: {
        height: 64,
        width: SIZES.width - 32,
        backgroundColor: "#1D272F",
        marginVertical: 22,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16
    },
    disclaimerView: {
        marginRight: 22,
        marginLeft: 12
    },
    disclaimerTitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.primary,
        lineHeight: 22
    },
    button: {
        width: SIZES.width - 32,
        borderRadius: 30,
        marginRight: 16,
        marginLeft: 16,
        height: 56
    },
    serviceSubtitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black
    },
    paymentBtn: {
        borderRadius: 32,
        height: 56,
        marginTop: 22
    },
    orderSuccess: {
        width: SIZES.width * 0.8,
        height: SIZES.width * 0.8
    },
    orderTitle: {
        fontSize: 22,
        fontFamily: "bold",
        color: COLORS.black,
        textAlign: "center",
        marginBottom: 16
    },
    orderSubtitle: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.gray,
        textAlign: "center"
    },
    homeBtn: {
        width: SIZES.width - 32,
        height: 56,
        borderRadius: 32,
        marginVertical: 32
    },
    orderView: {
        top: -82,
        backgroundColor: COLORS.white,
        paddingVertical: 48
    },
    inputLeft: {
        flexDirection: "column",
    },
    inputRight: {
        flexDirection: "column"
    },
    weightText: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.gray,
        textAlign: "center"
    }
})

export default OrderDetails
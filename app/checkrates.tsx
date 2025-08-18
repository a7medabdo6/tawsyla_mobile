import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ImageSourcePropType, ScrollView } from 'react-native';
import React, { useRef } from 'react';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import Button from '../components/Button';
import RBSheet from "react-native-raw-bottom-sheet"
import RateItem from '@/components/RateItem';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const CheckRates = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const bottomSheetRef = useRef<any>(null);
    /**
     * 
     * @returns render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.headerIconContainer, { 
                        borderColor: COLORS.grayscale200,
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
                }]}>Check Rates</Text>
                <Text>{" "}</Text>
            </View>
        );
    };

    /**
     * Render content
     */
    const renderContent = () => {
        const [pickUpLocation, setPickUpLocation] = React.useState('');
        const [packageDestination, setPackageDestination] = React.useState('');
        const [packageWeight, setPackageWeight] = React.useState('');


        return (
            <View>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="record-circle-outline" size={24} color={COLORS.primary} />
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder='Pick up Location'
                            placeholderTextColor={COLORS.gray}
                            style={[styles.input, { 
                                color: COLORS.black
                            }]}
                            onChangeText={(text) => setPickUpLocation(text)}
                        />
                        <TouchableOpacity>
                            <Image
                                source={icons.gps}
                                resizeMode='contain'
                                style={styles.gpsIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome6 name="location-dot" size={24} color={COLORS.primary} />
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder='Package Destination'
                            placeholderTextColor={COLORS.gray}
                            style={[styles.input, { 
                                color: COLORS.black
                            }]}
                            onChangeText={(text) => setPackageDestination(text)}
                        />
                        <TouchableOpacity>
                            <Image
                                source={icons.gps}
                                resizeMode='contain'
                                style={styles.gpsIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={[styles.inputTitle, { 
                    color: COLORS.black
                }]}>Dimensions</Text>
                <View style={styles.dimensionInput}>
                    <TouchableOpacity>
                        <Image
                            source={icons.boxSearch}
                            resizeMode='contain'
                            style={styles.boxIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholderTextColor={COLORS.gray}
                        placeholder='0'
                        style={[styles.inputBox, { 
                            color: COLORS.black
                        }]}
                        value={packageWeight}
                        onChangeText={(text) => setPackageWeight(text)}
                    />
                    <TouchableOpacity>
                        <Text style={{ 
                            ...FONTS.body3,
                            color: COLORS.black
                         }}>Kg</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Check"
                    filled
                    style={{
                        borderRadius: 30,
                        height: 56,
                        marginVertical: 22
                    }}
                    onPress={() => {
                        bottomSheetRef.current.open();
                    }}
                />
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
            <RBSheet
                ref={bottomSheetRef}
                height={420}
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
                    marginVertical: 22
                }}>
                    <View style={styles.view}>
                        <View style={styles.exchangeView}>
                            <Text style={[styles.exchangeTitle, { 
                                color: COLORS.black
                            }]}>1254 Kanata, Ottawa</Text>
                            <Text style={styles.exchangeSubtitle}>Picked Up</Text>
                        </View>
                        <Image
                            source={icons.exchange}
                            resizeMode='contain'
                            style={styles.exchangeIcon}
                        />
                        <View style={styles.exchangeView}>
                            <Text style={[styles.exchangeTitle, { 
                                color: COLORS.black
                            }]}>2541  Orleans, Toronto</Text>
                            <Text style={styles.exchangeSubtitle}>Destionation</Text>
                        </View>
                    </View>
                    <View style={styles.separateLine} />
                    <View style={{ marginTop: 12 }}>
                        <RateItem
                            pkgIcon={icons.package2}
                            title="Regular"
                            duration="2 - 3 Days"
                            price="$15"
                            onPress={() => {
                                bottomSheetRef.current.close();
                                navigation.goBack()
                            }}
                        />
                        <RateItem
                            pkgIcon={icons.package2}
                            title="Cargo"
                            duration="3 - 6 Days"
                            price="$31"
                            onPress={() => {
                                bottomSheetRef.current.close();
                                navigation.goBack()
                            }}
                        />
                        <RateItem
                            pkgIcon={icons.cargo}
                            title="Express"
                            duration="1 - 2 Days"
                            price="$42"
                            onPress={() => {
                                bottomSheetRef.current.close();
                                navigation.goBack()
                            }}
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
        alignItems: 'center'
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        marginTop: 16,
        marginBottom: 12
    },
    gpsIcon: {
        width: 24,
        height: 24,
        tintColor: "gray"
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        height: 52,
        borderWidth: .3,
        borderColor: COLORS.gray,
        flex: 1,
        marginLeft: 22,
        paddingHorizontal: 6,
        borderRadius: 8
    },
    input: {
        flex: 1
    },
    inputTitle: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.black
    },
    dimensionInput: {
        width: SIZES.width - 32,
        height: 52,
        borderWidth: .3,
        borderColor: COLORS.gray,
        borderRadius: 8,
        marginVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8
    },
    boxIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    inputBox: {
        flex: 1,
        paddingHorizontal: 8,
        fontSize: 16,
        fontFamily: "medium"
    },
    view: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    exchangeTitle: {
        fontSize: 14,
        fontFamily: "bold",
        color: COLORS.black,
        marginBottom: 6
    },
    exchangeSubtitle: {
        fontSize: 12,
        fontFamily: "medium",
        color: "gray"
    },
    exchangeView: {
        width: 92
    },
    exchangeIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    separateLine: {
        height: .6,
        borderWidth: .2,
        borderColor: COLORS.gray,
        marginVertical: 12
    },
})

export default CheckRates
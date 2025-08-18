import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES, icons, images } from '@/constants';
import { NavigationProp } from '@react-navigation/native';
import { Fontisto } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const MyOrderTrack = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    /**
    * Render header
    */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back as ImageSourcePropType}
                            resizeMode='contain'
                            style={[styles.backIcon, {
                                tintColor: COLORS.black
                            }]} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, {
                        color: COLORS.black
                    }]}>Tracking Orders</Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.moreCircle as ImageSourcePropType}
                        resizeMode='contain'
                        style={[styles.moreIcon, {
                            tintColor: COLORS.black
                        }]}
                    />
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[styles.bottomContainer, { backgroundColor: COLORS.white }]}>
                        <View style={styles.separateLine} />
                        <View style={styles.driverInfoContainer}>
                            <View style={styles.driverLeftInfo}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("whatsyourmood")
                                    }}>
                                    <Image
                                        source={images.user3}
                                        resizeMode='contain'
                                        style={styles.driverImage}
                                    />
                                </TouchableOpacity>
                                <View>
                                    <Text style={[styles.driverName, {
                                        color: COLORS.greyscale900
                                    }]}>Juliana Mirati</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("writereview")
                                        }}
                                        style={styles.driverRightReview}>
                                        <Image
                                            source={icons.star2 as ImageSourcePropType}
                                            resizeMode='contain'
                                            style={styles.starIcon}
                                        />
                                        <Text style={[styles.starNum, {
                                            color: COLORS.greyscale900
                                        }]}>4.8</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.driverRightContainer}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("chat")}>
                                    <Image
                                        source={icons.chatBubble2Outline as ImageSourcePropType}
                                        resizeMode='contain'
                                        style={styles.chatIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("call")}>
                                    <Image
                                        source={icons.telephoneOutline as ImageSourcePropType}
                                        resizeMode='contain'
                                        style={styles.phoneIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.separateLine} />
                        <View style={styles.summaryViewContainer}>
                            <View style={styles.viewItemContainer}>
                                <View style={styles.viewIconContainer}>
                                    <Image
                                        source={icons.document2 as ImageSourcePropType}
                                        resizeMode='contain'
                                        style={styles.viewIcon}
                                    />
                                </View>
                                <Text style={[styles.viewTitle, {
                                    color: COLORS.greyscale900
                                }]}>SK26273739</Text>
                                <Text style={[styles.viewSubtitle, {
                                    color: COLORS.grayscale700
                                }]}>Track ID</Text>
                            </View>
                            <View style={styles.viewItemContainer}>
                                <View style={styles.viewIconContainer}>
                                    <Image
                                        source={icons.clockTime as ImageSourcePropType}
                                        resizeMode='contain'
                                        style={styles.viewIcon}
                                    />
                                </View>
                                <Text style={[styles.viewTitle, {
                                    color: COLORS.greyscale900
                                }]}>2-3 days</Text>
                                <Text style={[styles.viewSubtitle, {
                                    color: COLORS.grayscale700
                                }]}>Estimate Time</Text>
                            </View>
                            <View style={styles.viewItemContainer}>
                                <View style={styles.viewIconContainer}>
                                    <Image
                                        source={icons.info as ImageSourcePropType}
                                        resizeMode='contain'
                                        style={styles.viewIcon}
                                    />
                                </View>
                                <Text style={[styles.viewTitle, {
                                    color: COLORS.greyscale900
                                }]}>2.4 Kg</Text>
                                <Text style={[styles.viewSubtitle, {
                                    color: COLORS.grayscale700
                                }]}>Package Weight</Text>
                            </View>
                        </View>
                        <View style={styles.separateLine} />
                        <View style={styles.locationItemContainer}>

                            <View style={{ flexDirection: "column" }}>
                                <View style={styles.orderDetailsContainer}>
                                    <View style={styles.orderViewContainer}>
                                        <Fontisto name="radio-btn-active" size={24} color={COLORS.grayscale400} />
                                        <View style={styles.orderView}>
                                            <Text style={[styles.orderDetailsTitle, {
                                                color: COLORS.black,
                                            }]}>Order In Transit - Dec 17</Text>
                                            <Text style={[styles.orderDetailsSubtitle, {
                                                color: COLORS.grayscale700
                                            }]}>32 Manchester Ave. Ringgold, GA 30736</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.deliveryTime, {
                                        color: COLORS.grayscale700
                                    }]}>15:20 PM</Text>
                                </View>
                                <View style={styles.orderDetailsContainer}>
                                    <View style={styles.orderViewContainer}>
                                        <Fontisto name="radio-btn-active" size={24} color={COLORS.grayscale400} />
                                        <View style={styles.orderView}>
                                            <Text style={[styles.orderDetailsTitle, {
                                                color: COLORS.black,
                                            }]}>Order In Transit - Dec 17</Text>
                                            <Text style={[styles.orderDetailsSubtitle, {
                                                color: COLORS.grayscale700
                                            }]}>32 Manchester Ave. Ringgold, GA 30736</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.deliveryTime, {
                                        color: COLORS.grayscale700
                                    }]}>15:20 PM</Text>
                                </View>
                                <View style={styles.orderDetailsContainer}>
                                    <View style={styles.orderViewContainer}>
                                        <Fontisto name="radio-btn-active" size={24} color={COLORS.grayscale400} />
                                        <View style={styles.orderView}>
                                            <Text style={[styles.orderDetailsTitle, {
                                                color: COLORS.black,
                                            }]}>Order ... Customs Port - Dec 16</Text>
                                            <Text style={[styles.orderDetailsSubtitle, {
                                                color: COLORS.grayscale700
                                            }]}>4 Evergreen Street Lake Zurich, IL 60047</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.deliveryTime, {
                                        color: COLORS.grayscale700
                                    }]}>14:40 PM</Text>
                                </View>
                                <View style={styles.orderDetailsContainer}>
                                    <View style={styles.orderViewContainer}>
                                        <Fontisto name="radio-btn-active" size={24} color={COLORS.primary} />
                                        <View style={styles.orderView}>
                                            <Text style={[styles.orderDetailsTitle, {
                                                color: COLORS.black,
                                            }]}>Order is in Packing - Dec 15</Text>
                                            <Text style={[styles.orderDetailsSubtitle, {
                                                color: COLORS.grayscale700
                                            }]}>891 Glen Ridge St. Gainesville, VA 20155</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.deliveryTime, {
                                        color: COLORS.grayscale700
                                    }]}>10:25 AM</Text>
                                </View>
                                <View style={styles.orderDetailsContainer}>
                                    <View style={styles.orderViewContainer}>
                                        <Fontisto name="radio-btn-active" size={24} color={COLORS.primary} />
                                        <View style={styles.orderView}>
                                            <Text style={[styles.orderDetailsTitle, {
                                                color: COLORS.black,
                                            }]}>Order is in Packing - Dec 15</Text>
                                            <Text style={[styles.orderDetailsSubtitle, {
                                                color: COLORS.grayscale700
                                            }]}>891 Glen Ridge St. Gainesville, VA 20155</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.deliveryTime, {
                                        color: COLORS.grayscale700
                                    }]}>10:25 AM</Text>
                                </View>
                                <View style={styles.orderDetailsContainer}>
                                    <View style={styles.orderViewContainer}>
                                        <Fontisto name="radio-btn-active" size={24} color={COLORS.primary} />
                                        <View style={styles.orderView}>
                                            <Text style={[styles.orderDetailsTitle, {
                                                color: COLORS.black,
                                            }]}>Verified Payments - Dec 15</Text>
                                            <Text style={[styles.orderDetailsSubtitle, {
                                                color: COLORS.grayscale700
                                            }]}>55 Summerhouse Dr. Apopka, FL 32703</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.deliveryTime, {
                                        color: COLORS.grayscale700
                                    }]}>10:04 AM</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 16
    },
    scrollView: {
        backgroundColor: COLORS.tertiaryWhite
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.black
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    bottomContainer: {
        backgroundColor: COLORS.white
    },
    btn: {
        width: SIZES.width - 32,
        marginTop: 12
    },
    locationMapContainer: {
        height: 226,
        width: "100%",
        borderRadius: 12,
        marginVertical: 16
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        borderRadius: 12,
        backgroundColor: COLORS.dark2
    },
    viewMapContainer: {
        height: 50,
        backgroundColor: COLORS.gray,
        alignItems: "center",
        justifyContent: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 'auto',
    },
    // Arrow below the bubble
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
    bottomTopContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 22,
    },
    bottomTopTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black
    },
    bottomTopSubtitle: {
        fontSize: 16,
        color: COLORS.greyscale900,
        fontFamily: "regular"
    },
    separateLine: {
        height: .4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12
    },
    addressItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 12
    },
    addressItemLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    driverInfoContainer: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    driverLeftInfo: {
        flexDirection: "row",
        alignItems: "center"
    },
    driverImage: {
        width: 52,
        height: 52,
        borderRadius: 999,
        marginRight: 12
    },
    driverName: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 4
    },
    driverCar: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: "regular",
        marginTop: 6
    },
    driverRightContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    driverRightReview: {
        flexDirection: "row",
        alignItems: "center"
    },
    starIcon: {
        height: 14,
        width: 14,
        tintColor: "orange",
        marginRight: 6
    },
    starNum: {
        fontSize: 16,
        color: COLORS.greyscale900,
        fontFamily: "regular"
    },
    taxiID: {
        fontSize: 14,
        color: COLORS.greyscale900,
        fontFamily: "medium",
        marginTop: 6
    },
    actionContainer: {
        flexDirection: "row",
        marginTop: 22
    },
    actionBtn: {
        width: 64,
        height: 64,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        marginHorizontal: 12
    },
    actionIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    locationItemContainer: {
        flexDirection: "row",
        width: "100%",
        marginVertical: 12,
        alignItems: "center",
        justifyContent: "space-between"
    },
    locationIcon1: {
        height: 52,
        width: 52,
        borderRadius: 999,
        marginRight: 12,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: "center",
        justifyContent: "center",
    },
    locationIcon2: {
        height: 36,
        width: 36,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    locationIcon3: {
        width: 16,
        height: 16,
        tintColor: COLORS.white
    },
    baseLocationName: {
        fontSize: 17,
        color: COLORS.greyscale900,
        fontFamily: "bold",
    },
    baseLocationAddress: {
        fontSize: 14,
        color: COLORS.greyScale800,
        fontFamily: "regular",
        marginTop: 8
    },
    arrowIconContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 12
    },
    arrowIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.black
    },
    locationDistance: {
        fontSize: 14,
        color: COLORS.greyscale900,
        fontFamily: "medium",
    },
    locationItemRow: {
        flexDirection: "row",
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.black,
        textAlign: "center",
        marginVertical: 12
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: "regular",
        color: COLORS.black,
        textAlign: "center",
        marginVertical: 12
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.56)"
    },
    modalSubContainer: {
        height: 520,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22
    },
    successBtn: {
        width: "100%",
        marginTop: 12,
        borderRadius: 32
    },
    receiptBtn: {
        width: "100%",
        marginTop: 12,
        borderRadius: 32,
        backgroundColor: COLORS.tansparentPrimary,
        borderColor: COLORS.tansparentPrimary
    },
    editPencilIcon: {
        width: 42,
        height: 42,
        tintColor: COLORS.white,
        zIndex: 99999,
        position: "absolute",
        top: 58,
        left: 58,
    },
    backgroundIllustration: {
        height: 150,
        width: 150,
        marginVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        zIndex: -999
    },
    happyMood: {
        fontSize: 154
    },
    orderDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12,
        width: "100%"
    },
    orderViewContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    orderDetailsTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black,
        marginBottom: 12
    },
    orderDetailsSubtitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.grayscale700
    },
    deliveryTime: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.grayscale700
    },
    orderView: {
        marginLeft: 12
    },
    chatIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary,
        marginRight: 12
    },
    phoneIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary,
        marginLeft: 12
    },
    summaryViewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: SIZES.width - 32,
    },
    viewItemContainer: {
        alignItems: "center",
    },
    viewIconContainer: {
        height: 64,
        width: 64,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.tansparentPrimary,
        marginBottom: 6
    },
    viewIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary
    },
    viewTitle: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.black,
        marginBottom: 6
    },
    viewSubtitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.grayscale700
    }
})

export default MyOrderTrack
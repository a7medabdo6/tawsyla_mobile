import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons } from '@/constants';
import { NavigationProp } from '@react-navigation/native';
import { transactionHistory } from '@/data';
import TransactionHistoryCard from '@/components/TransactionHistoryCard';
import { useNavigation } from 'expo-router';

const TransactionHistoryScreen = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    /**
    * render header
    */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            contentFit='contain'
                            style={[styles.headerLogo, {
                                tintColor: COLORS.greyscale900
                            }]}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, {
                        color: COLORS.greyscale900
                    }]}>Transaction History</Text>
                </View>
                <View style={styles.headerRight}>
                    {/* <TouchableOpacity>
                        <Image
                            source={icons.moreCircle}
                            contentFit='contain'
                            style={[styles.searchIcon, {
                                tintColor: COLORS.greyscale900
                            }]}
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <FlatList
                    data={transactionHistory}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TransactionHistoryCard
                            title={item.title}
                            description={item.description}
                            date={item.date}
                            type={item.type}
                            onPress={() => console.log("Click")}
                        />
                    )}
                />
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
        width: SIZES.width - 32,
        justifyContent: "space-between",
        marginBottom: 12
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerLogo: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: "bold",
        color: COLORS.black,
        marginLeft: 12
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    moreCircleIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
        marginLeft: 12
    }
})

export default TransactionHistoryScreen
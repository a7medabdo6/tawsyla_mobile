import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-virtualized-view';
import { notifications } from '@/data';
import NotificationCard from '@/components/NotificationCard';
import { useNavigation } from 'expo-router';
import { useLanguageContext } from '@/contexts/LanguageContext';
import Header from '@/components/Header';

const Notifications = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { t, isRTL } = useLanguageContext();

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
                            style={[styles.backIcon, {
                                transform: isRTL ? [{ scaleX: -1 }] : [],
                                tintColor: COLORS.black,
                                marginRight: isRTL ? 0 : 16,
                                marginLeft: isRTL ? 16 : 0
                            }]} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, {
                        color: COLORS.black
                    }]}>{t('notifications.title')}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("(tabs)",{screen:"profile"})
                    // Navigate to notification settings or show settings modal
                    console.log('Notification settings pressed');
                }}>
                    <Image
                        source={icons.setting2Outline}
                        contentFit='contain'
                        style={[styles.moreIcon, {
                            tintColor: COLORS.black
                        }]}
                    />
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { 
                backgroundColor: COLORS.white,
                direction: isRTL ? "rtl" : "ltr"
            }]}>
 <Header
          title={t('notifications.title')}
        />                <ScrollView showsVerticalScrollIndicator={false}>
                    {notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => (
                                <NotificationCard
                                    title={item.title}
                                    description={item.description}
                                    date={item.date}
                                    time={item.time}
                                    type={item.type}
                                    isNew={item.isNew}
                                />
                            )}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{t('notifications.noNotifications')}</Text>
                        </View>
                    )}
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
        color: COLORS.black,
        textAlign: "center"
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.gray,
        textAlign: 'center'
    }
})

export default Notifications
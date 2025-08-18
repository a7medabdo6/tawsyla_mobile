import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '@/constants';
import { Image } from 'expo-image';
import { getTimeAgo } from '@/utils/date';

interface TransactionHistoryCardProps {
    title: string;
    description: string;
    date: string;
    type: string;
    onPress: () => void;
}

const TransactionHistoryCard: React.FC<TransactionHistoryCardProps> = ({
    title,
    description,
    date,
    type,
    onPress
}) => {
    let iconSource;

    switch (type) {
        case 'Order':
            iconSource = icons.editService2;
            break;
        case 'Payment':
            iconSource = icons.wallet2;
            break;
        case 'Topup':
            iconSource = icons.arrowUpSquare;
            break;
        default:
            iconSource = icons.editService2;
    }

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={iconSource}
                        contentFit='contain'
                        style={styles.icon}
                    />
                </View>
                <View style={styles.viewContainer}>
                    <Text style={[styles.title, { 
                        color: COLORS.black
                    }]}>{title}</Text>
                    <Text style={[styles.description, { 
                        color: COLORS.black
                    }]}>{description}</Text>
                </View>
            </View>
            <Text style={styles.duration}>{getTimeAgo(date)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(34, 187, 156, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    icon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary
    },
    viewContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 18,
        color: COLORS.black,
        fontFamily: "bold",
        marginBottom: 6
    },
    description: {
        fontSize: 14,
        color: COLORS.black,
        fontFamily: "regular",
    },
    duration: {
        fontSize: 13,
        color: COLORS.primary,
        fontFamily: "bold",
    }
});

export default TransactionHistoryCard;

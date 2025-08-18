import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { AntDesign } from '@expo/vector-icons';
import { COLORS, SIZES, icons } from '../constants';
import { TrackingHistory } from '@/data';
import { NavigationProp } from '@react-navigation/native';
import NoHistory from '@/components/NoHistory';
import TrackCard from '@/components/TrackCard';
import { useNavigation } from 'expo-router';

const TrackIDNumber = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [trackingHistory, setTrackingHistory] = useState(TrackingHistory);

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
        }]}>Track</Text>
        <Text>{" "}</Text>
      </View>
    );
  };

  const renderContent = () => {
    const filteredTrackingHistory = trackingHistory.filter((item) =>
      item.number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteItemByNumber = (itemNumber: any) => {
      const updatedTrackingHistory = trackingHistory.filter(
        (item) => item.number !== itemNumber
      );
      setTrackingHistory(updatedTrackingHistory);
    };

    return (
      <View>
        <View style={styles.topContainer}>
          <Text style={[styles.trackingHistory, { 
            color: COLORS.black
          }]}>Tracking History</Text>
          <TouchableOpacity onPress={() => setTrackingHistory([])}>
            <Text style={styles.deleteAll}>Delete All</Text>
          </TouchableOpacity>
        </View>
        {/* For suggestion id number */}
        {/* {
          filteredTrackingHistory.length === 0 ? (
            <NoHistory />
          ) : (
            <FlatList
              data={filteredTrackingHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.viewContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate("TrackingOrders")} style={styles.viewLeft}>
                    <TouchableOpacity>
                      <Feather name='clock' size={24} color={COLORS.gray} />
                    </TouchableOpacity>
                    <Text style={styles.viewNumber}>{item.number}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItemByNumber(item.number)}>
                    <AntDesign name='close' size={24} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )
        } */}

        {
          filteredTrackingHistory.length === 0 ? (
            <NoHistory />
          ) : (
            <FlatList
              data={filteredTrackingHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TrackCard
                  number={item.number}
                  description={item.description}
                  status={item.status}
                  onPress={() => navigation.navigate("trackingpackage")}
                />
              )}
            />
          )}
      </View>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={[styles.searchBarContainer, { 
        backgroundColor: "#F9F9F9",
      }]}>
        <TouchableOpacity>
          <AntDesign name='search1' size={24} color={COLORS.gray} />
        </TouchableOpacity>
        <TextInput
          placeholder='Enter track number'
          placeholderTextColor={COLORS.gray}
          style={[styles.input, { 
            color: COLORS.greyscale900
          }]}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={() => navigation.navigate("scanqrcode")}>
          <AntDesign name='scan1' size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        {renderSearchBar()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
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
  searchBarContainer: {
    width: SIZES.width - 32,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginVertical: 22
  },
  input: {
    flex: 1,
    paddingHorizontal: 12
  },
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginVertical: 6
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  viewNumber: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
    marginLeft: 22
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22
  },
  trackingHistory: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black
  },
  deleteAll: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.primary,
  }
});

export default TrackIDNumber
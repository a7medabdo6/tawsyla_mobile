import { View, Text, TouchableOpacity, Image, useWindowDimensions, StatusBar, ImageSourcePropType, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { COLORS, icons, images } from '@/constants';
import { FromMeRoute, ToMeRoute } from '@/tabs';

const renderScene = SceneMap({
  first: FromMeRoute,
  second: ToMeRoute,
});

const MyOrder = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'first', title: 'From Me' },
    { key: 'second', title: 'To Me' },
  ])

  const renderTabBar = (props:any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary
      }}
      style={{
        backgroundColor: COLORS.white,
      }}
      renderLabel={({ route, focused }) => (
        <Text style={[{ 
          color: focused ? COLORS.primary : 'gray',
          fontSize: 16,
          fontFamily: "bold"
          }]}>
          {route.title}
        </Text>
      )}
    />
  );

   /**
   * render header
   */
    const renderHeader = () => {
      return (
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image
              source={images.logo as ImageSourcePropType}
              resizeMode='contain'
              style={styles.headerLogo}
            />
            <Text style={[styles.headerTitle, {
              color: COLORS.greyscale900
            }]}>My Orders</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Image
                source={icons.moreCircle as ImageSourcePropType}
                resizeMode='contain'
                style={[styles.moreCircleIcon, {
                  tintColor: COLORS.greyscale900
                }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar hidden={true} />
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        {renderHeader()}
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerLogo: {
    height: 36,
    width: 36,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 20,
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
  },
})
export default MyOrder
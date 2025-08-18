import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { MaterialIcons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '@/components/Button';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { launchImagePicker } from '@/utils/ImagePickerHelper';
import { useNavigation } from 'expo-router';
import SettingsItem from '@/components/SettingsItem';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useAuthStatus, useLogout, getStoredUser } from '@/data/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Nav = {
  navigate: (value: string) => void
}

const Profile = () => {
  const refRBSheet = useRef<any>(null);
  const { navigate } = useNavigation<Nav>();
  const { t, isRTL } = useLanguageContext();
    // Use the auth hooks from useAuth
  const { data: authStatus, isLoading } = useAuthStatus();
  const logoutMutation = useLogout();
  // const token = await AsyncStorage.getItem('token');

  // console.log('Profile Component - authStatus:', authStatus, 'isLoading:', isLoading);
useEffect(() => {
  console.log('Profile Component - authStatus:', authStatus, 'isLoading:', isLoading);
}, [authStatus, isLoading]);

  // Check if logout is in progress
  const isLoggingOut = logoutMutation.isPending;

    const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      refRBSheet.current.close();
      navigate("index");

      // Navigation will be handled by useEffect below
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Handle navigation after successful logout

  /**
   * render header
   */
  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={[styles.headerLeft, ]}>
          <Image
            source={images.logo}
            contentFit='contain'
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900,
            marginLeft: isRTL ? 0 : 12,
            marginRight: isRTL ? 12 : 0
          }]}>{t('profile.title')}</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            contentFit='contain'
            style={[styles.headerIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
  // Move useState hook to component top level
  const [image, setImage] = useState(images.user1);

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker()

      if (!tempUri) return

      // Set the image
      setImage({ uri: tempUri })
    } catch (error) { }
  };

  /**
   * render user profile
   */
  const renderProfile = () => {
    return (
      <View style={[styles.profileContainer, { direction: isRTL ? "rtl" : "ltr" }]}>
        <View>
          <Image
            source={authStatus?.isAuthenticated ? image : images.avatar}
            contentFit='cover'
            style={[styles.avatar, !authStatus?.isAuthenticated && styles.guestAvatar]}
          />
          {authStatus?.isAuthenticated && (
            <TouchableOpacity
              onPress={pickImage}
              style={[styles.picContainer, { 
                right: isRTL ? 'auto' : 0,
                left: isRTL ? 0 : 'auto'
              }]}>
              <MaterialIcons name="edit" size={16} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
        {authStatus?.isAuthenticated ? (
          <>
            <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
              {authStatus?.user?.firstName ? `${authStatus.user.firstName} ${authStatus.user.lastName}` : t('profile.userName')}
            </Text>
            <Text style={[styles.subtitle, { color: COLORS.greyscale900 }]}>
              {authStatus?.user?.email || t('profile.userEmail')}
            </Text>
          </>
        ) : (
          <>
            <View style={styles.guestBadge}>
              <MaterialIcons name="person-outline" size={16} color={COLORS.greyscale600} />
              <Text style={styles.guestBadgeText}>{t('profile.guest')}</Text>
            </View>
            <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
              {t('profile.guestUser')}
            </Text>
            <Text style={[styles.subtitle, { color: COLORS.greyscale500 }]}>
              {t('profile.guestSubtitle')}
            </Text>
          </>
        )}
      </View>
    )
  }

  // Move useState hook to component top level
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  /**
   * Render Settings
   */
  const renderSettings = () => {

    return (
      <View style={[styles.settingsContainer, ]}>
        {/* Only show these items if user is authenticated */}
        {authStatus?.isAuthenticated ? (
          <>
            <SettingsItem
              icon={icons.bell3}
              name={t('profile.myNotification')}
              onPress={() => navigate("notifications")}
            />
            <SettingsItem
              icon={icons.location2Outline}
              name={t('profile.address')}
              onPress={() => navigate("address")}
            />
            <SettingsItem
              icon={icons.userOutline}
              name={t('profile.editProfile')}
              onPress={() => navigate("editprofile")}
            />
            <SettingsItem
              icon={icons.wallet2Outline}
              name={t('profile.payment')}
              onPress={() => navigate("settingspayment")}
            />
          </>
        ) : (
          /* Show login button when not authenticated */
          <TouchableOpacity
            onPress={() => navigate("login")}
            style={styles.loginButtonContainer}>
            <View style={styles.loginLeftContainer}>
              <Image
                source={icons.userOutline}
                contentFit='contain'
                style={[styles.settingsIcon, {
                  tintColor: COLORS.primary
                }]}
              />
              <Text style={[styles.loginButtonText, {
                color: COLORS.primary,
                marginLeft: isRTL ? 0 : 12,
                marginRight: isRTL ? 8 : 0
              }]}>{t('profile.login')}</Text>
            </View>
            <Image
              source={icons.arrowRight}
              contentFit='contain'
              style={[styles.settingsArrowRight, {
                tintColor: COLORS.primary,
                transform: isRTL ? [{ scaleX: -1 }] : []
              }]}
            />
          </TouchableOpacity>
        )}
        
        {/* These items are always visible */}
        <SettingsItem
          icon={icons.bell2}
          name={t('profile.notification')}
          onPress={() => navigate("settingsnotifications")}
        />
        <SettingsItem
          icon={icons.shieldOutline}
          name={t('profile.security')}
          onPress={() => navigate("settingssecurity")}
        />
        <TouchableOpacity
          onPress={() => navigate("settingslanguage")}
          style={styles.settingsItemContainer}>
          <View style={[styles.leftContainer, ]}>
            <Image
              source={icons.more}
              contentFit='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900,
              marginLeft: isRTL ? 0 : 12,
              marginRight: isRTL ? 12 : 0
            }]}>{t('profile.languageRegion')}</Text>
          </View>
          <View style={[styles.rightContainer, ]}>
            <Text style={[styles.rightLanguage, {
              color: COLORS.greyscale900,
              marginRight: isRTL ? 0 : 8,
              marginLeft: isRTL ? 8 : 0
            }]}>{t('profile.currentLanguage')}</Text>
            <Image
              source={icons.arrowRight}
              contentFit='contain'
              style={[styles.settingsArrowRight, {
                tintColor: COLORS.greyscale900,
                transform: isRTL ? [{ scaleX: -1 }] : []
              }]}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItemContainer}>
          <View style={[styles.leftContainer,]}>
            <Image
              source={icons.show}
              contentFit='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900,
              marginLeft: isRTL ? 0 : 12,
              marginRight: isRTL ? 12 : 0
            }]}>{t('profile.darkMode')}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>
        <SettingsItem
          icon={icons.lockedComputerOutline}
          name={t('profile.privacyPolicy')}
          onPress={() => navigate("settingsprivacypolicy")}
        />
        <SettingsItem
          icon={icons.infoCircle}
          name={t('profile.helpCenter')}
          onPress={() => navigate("settingshelpcenter")}
        />
        <SettingsItem
          icon={icons.people4}
          name={t('profile.inviteFriends')}
          onPress={() => navigate("settingsinvitefriends")}
        />
        {authStatus?.isAuthenticated && (
          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            style={[styles.logoutContainer, isLoggingOut && styles.logoutContainerDisabled]}
            disabled={isLoggingOut}>
            <View style={[styles.logoutLeftContainer, ]}>
              <Image
                source={icons.logout}
                contentFit='contain'
                style={[styles.logoutIcon, {
                  tintColor: isLoggingOut ? COLORS.grayscale400 : "red"
                }]}
              />
              <Text style={[styles.logoutName, {
                color: isLoggingOut ? COLORS.grayscale400 : "red",
                marginLeft: isRTL ? 0 : 12,
                marginRight: isRTL ? 12 : 0
              }]}>{isLoggingOut ? 'Logging out...' : t('profile.logout')}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" }]}>
        <View style={[styles.container, { backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: COLORS.greyscale900 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" }]} key={`profile-${authStatus?.isAuthenticated ? 'auth' : 'guest'}`}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {authStatus?.isAuthenticated && renderProfile()}
          {renderSettings()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={240}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: COLORS.grayscale200,
            height: 4
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 240,
            backgroundColor: COLORS.white
          }
        }}>
        <Text style={[styles.bottomTitle, { textAlign: isRTL ? 'right' : 'center' }]}>{t('profile.logout')}</Text>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200,
        }]} />
        <Text style={[styles.bottomSubtitle, {
          color: COLORS.black,
          textAlign: isRTL ? 'right' : 'center'
        }]}>{t('profile.logoutConfirm')}</Text>
        <View style={[styles.bottomContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Button
            title={t('profile.cancel')}
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary
            }}
            textColor={COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title={isLoggingOut ? 'Logging out...' : t('profile.yesLogout')}
            filled
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          />
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
    padding: 16,
    marginBottom: 32
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  profileContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: .4,
    paddingVertical: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999
  },
  guestAvatar: {
    opacity: 0.7,
    tintColor: COLORS.grayscale400
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayscale200,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8
  },
  guestBadgeText: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.greyscale600,
    marginLeft: 6
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: 0,
    bottom: 12
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginTop: 12
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "medium",
    marginTop: 4
  },
  settingsContainer: {
    marginVertical: 12
  },
  settingsItemContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  settingsName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginRight: 8
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: .8 }, { scaleY: .8 }], // Adjust the size of the switch
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  logoutContainerDisabled: {
    opacity: 0.6
  },
  logoutLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  logoutName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  loginButtonContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  loginLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.primary,
    marginLeft: 12
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  logoutButtonDisabled: {
    backgroundColor: COLORS.grayscale400
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12
  }
})

export default Profile
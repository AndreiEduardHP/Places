import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'

import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import ProfileSection from '../Components/SettingSections/ProfileSection'
import ProfileDetails from '../Components/SettingSections/ProfileDetails'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ProfileScreen: React.FC = () => {
  const { loggedUser } = useUser()
  const { t } = useTranslation()
  const { backgroundColor, textColor } = useThemeColor()
  const handleNavigation = useHandleNavigation()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
    gradient: {
      height: 120,
      position: 'absolute',
      zIndex: 10,
      top: 100,
    },
    header: {
      alignItems: 'center',
    },
    text: {
      fontSize: 32,
      fontWeight: '300',
      marginHorizontal: 20,
      color: textColor,
    },

    profilePic: {
      width: 110,
      height: 110,
      marginVertical: 5,

      borderRadius: 100,
      ...Platform.select({
        ios: {
          shadowColor: 'white',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        },
        android: {},
      }),
    },
    item: {
      width: '100%',
      height: 120,
    },
    name: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 10,
      letterSpacing: -0.7,
      color: 'white',
    },
    title: {
      color: 'white',
    },
    phone: {
      color: 'white',
      marginTop: 5,
      fontSize: 18,
    },
    email: {
      color: 'white',
      marginTop: 5,
      fontSize: 18,
    },
    walletContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 3,
      borderBottomColor: 'rgba(255, 255, 255, 0.35)',
      borderRadius: 8,
    },
    walletText: {
      fontSize: 18,
      fontWeight: '500',
      color: 'white',
    },
    walletTextsum: {
      fontSize: 18,
      fontWeight: '500',
      color: 'rgba(140, 255, 0, 0.9)',
    },
    ordersText: {
      fontSize: 18,
      color: 'white',
    },
    button: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(11, 11, 11, 0.41)',
      borderRadius: 8,
    },
    buttonText: {
      fontSize: 16,

      color: 'white',
    },
    logoutButton: {
      padding: 20,
      borderTopWidth: 2,
      borderTopColor: 'rgba(255,255, 255, 0.35)',
      borderRadius: 8,
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 1,
        },
      }),
    },
    logoutButtonText: {
      fontSize: 16,
      color: 'rgba(255,111,111,1)',
      paddingTop: 3,
      fontWeight: '400',
    },
    deleteAccountButton: {
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 1,
        },
      }),
    },
    deleteAccountButtonText: {
      fontSize: 16,
      color: 'rgba(255,111,111,1)',
      paddingTop: 3,
      fontWeight: '400',
    },
    editIcon: { paddingTop: 5, alignItems: 'center', color: 'white' },
    editIconLogo: { paddingTop: 70, alignItems: 'center' },
  })
  const userProfileData: {
    icon: string
    label: string
    value: string | number | undefined
  }[] = [
    { icon: 'location-city', label: t('labels.city'), value: loggedUser?.city },
    {
      icon: 'credit-score',
      label: t('labels.credits'),
      value: loggedUser?.credit,
    },
    {
      icon: 'alternate-email',
      label: t('labels.email'),
      value: loggedUser?.email,
    },
    {
      icon: 'interests',
      label: t('labels.interest'),
      value: loggedUser?.interest,
    },
    {
      icon: 'phone-callback',
      label: t('labels.phoneNumber'),
      value: loggedUser?.phoneNumber,
    },
    { icon: 'badge', label: t('labels.username'), value: loggedUser?.username },
  ]
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.text}>{t('profileScreen.accountDetails')}</Text>
        <ProfileSection
          showEditIcon={false}
          showTouchIcon={false}></ProfileSection>
        <ProfileDetails data={userProfileData}></ProfileDetails>
        <TouchableOpacity onPress={() => handleNavigation('MyAwardsScreen')}>
          <ProfileDetails
            showIcon={true}
            data={[
              {
                icon: 'military-tech',
                label: t('profileScreen.myAwards'),
                value: '2',
              },
            ]}></ProfileDetails>
        </TouchableOpacity>
      </ScrollView>

      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
  {
    /* <>
      <ScrollView style={styles.container}>
        <ImageBackground
          source={require('../../assets/menu-bg.jpg')}
          resizeMode="cover"
          imageStyle={{ opacity: 0.85 }}>
          <View style={styles.header}>
            <LinearGradient
              colors={
                loggedUser?.themeColor === 'dark'
                  ? generateBlackGradientColors(10)
                  : generateWhiteGradientColors(10)
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',

                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  paddingLeft: 50,
                }}>
                <Image
                  source={
                    loggedUser?.profilePicture !== ''
                      ? { uri: imageUri }
                      : require('../../assets/DefaultUserIcon.png')
                  }
                  style={styles.profilePic}
                />
                <TouchableOpacity
                  onPress={() => {
                    selectImage()
                  }}
                  style={styles.editIconLogo}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        tintColor: 'white',
                      }}
                      source={require('../../assets/Icons/edit.png')}
                    />
                    <Text style={styles.editIcon}>Edit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={{ flexDirection: 'row' }}>
              <Greeting style={styles.name} />
              <Text style={styles.name}>
                {loggedUser?.firstName} {loggedUser?.lastName}
              </Text>
            </View>
            <View></View>
            <Text style={[styles.title, { marginTop: 5, fontSize: 18 }]}>
              Interests: {loggedUser?.interest}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  marginTop: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/phone-call.png')}
              />
              <Text style={styles.phone}> {loggedUser?.phoneNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  marginTop: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/email.png')}
              />
              <Text style={styles.email}> {loggedUser?.email}</Text>
            </View>
          </View>

          <View style={styles.walletContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.walletText}>Credits: </Text>
              <Text style={styles.walletTextsum}>
                {loggedUser?.credit !== null ? loggedUser?.credit : 0}
              </Text>
            </View>

            <TouchableOpacity onPress={() => handleNavigation('Chat')}>
              <Text style={styles.ordersText}>
                Connections: {connectionsCount}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('FriendRequestScreen')}>
            <Text style={styles.buttonText}>
              {' '}
              Friend Requests: {friendRequestsCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('PaymentScreen')}>
            <Text style={styles.buttonText}>Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Tell Your Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('EditUserProfileScreen')}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleLogout()
              handleNavigation('DefaultScreen')
            }}
            style={styles.logoutButton}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/logout.png')}
              />
              <Text style={styles.logoutButtonText}>Log out</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleLogout()
              handleNavigation('DefaultScreen')
            }}
            style={styles.deleteAccountButton}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/delete.png')}
              />
              <Text style={styles.deleteAccountButtonText}>Delete account</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', margin: 10 }}>
                powered by google
              </Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
      <View>
        <FooterNavbar currentRoute={'ProfileScreen'} />
      </View>
    </> */
  }
}

export default ProfileScreen

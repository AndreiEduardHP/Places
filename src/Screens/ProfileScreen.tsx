import { t } from 'i18next'
import React from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import ProfileSection from '../Components/SettingSections/ProfileSection'
import ProfileDetails from '../Components/SettingSections/ProfileDetails'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import BackAction from '../Components/Back'

const ProfileScreen: React.FC = () => {
  const { loggedUser } = useUser()
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
      fontSize: 22,

      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
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
      label: 'Interest',
      value: loggedUser?.interest,
    },
    {
      icon: 'description',
      label: 'Description',
      value: loggedUser?.description,
    },
    {
      icon: 'phone-callback',
      label: t('labels.phoneNumber'),
      value: loggedUser?.phoneNumber,
    },
    {
      icon: 'badge',
      label: t('labels.username'),
      value: loggedUser?.firstName + ' ' + loggedUser?.lastName.charAt(0),
    },
  ]
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BackAction />
        <Text style={styles.text}>{t('profileScreen.accountDetails')}</Text>
      </View>
      <ScrollView style={styles.container}>
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
                value: '',
              },
            ]}></ProfileDetails>
        </TouchableOpacity>
      </ScrollView>

      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
}

export default ProfileScreen

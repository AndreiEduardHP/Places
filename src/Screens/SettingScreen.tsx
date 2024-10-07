import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import ProfileSection from '../Components/SettingSections/ProfileSection'
import InformationSection from '../Components/SettingSections/Information'
import AccountSection from '../Components/SettingSections/AccountSettings'
import EventSection from '../Components/SettingSections/EventSection'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import BackAction from '../Components/Back'
import { t } from 'i18next'

const SettingScreen: React.FC = () => {
  const { backgroundColor, textColor } = useThemeColor()
  const handleNavigation = useHandleNavigation()
  const { refreshData } = useUser()
  useEffect(() => {
    refreshData()
  }, [])

  const styles = StyleSheet.create({
    containerScroll: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 22,

      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
    content: {
      justifyContent: 'center',

      padding: 10,
    },

    header: {
      fontSize: 28,
      fontWeight: '400',
      margin: 20,
      color: textColor,
    },
    logoutButton: {
      marginTop: 20,
      color: 'blue',
      textDecorationLine: 'underline',
    },
    noUserText: {
      fontSize: 16,
      color: 'red',
    },
    footer: {
      padding: 10,
      justifyContent: 'flex-end',
    },
  })
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <BackAction />
          <Text style={styles.text}>{t('settingsScreen.settings')}</Text>
        </View>

        <TouchableOpacity onPress={() => handleNavigation('ProfileScreen')}>
          <ProfileSection
            showEditIcon={false}
            showTouchIcon={true}></ProfileSection>
        </TouchableOpacity>
        <AccountSection></AccountSection>
        <EventSection></EventSection>
        <InformationSection></InformationSection>
      </ScrollView>
      <FooterNavbar currentRoute={'SettingScreen'}></FooterNavbar>
    </View>
  )
}

export default SettingScreen

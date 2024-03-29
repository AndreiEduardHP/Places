import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import DarkMode from '../Components/SwitchDarkMode'

import i18n from '../TranslationFiles/i18n'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { useNotification } from '../Components/Notification/NotificationProvider'
import SupportTicket from '../Components/SupportTicket'
import ChatComponent from './test200'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import ProfileSection from '../Components/SettingSections/ProfileSection'
import InformationSection from '../Components/SettingSections/Information'
import AccountSection from '../Components/SettingSections/AccountSettings'
import EventSection from '../Components/SettingSections/EventSection'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useHandleNavigation } from '../Navigation/NavigationUtil'

const SettingScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, refreshData } = useUser()
  const { backgroundColor, textColor } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()

  const handleTicketSubmit = (ticket: {
    title: string
    description: string
  }) => {}
  const styles = StyleSheet.create({
    containerScroll: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 32,
      fontWeight: '300',
      marginHorizontal: 20,
      color: textColor,
    },
    content: {
      justifyContent: 'center',
      //  alignItems: 'center',
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
        <Text style={styles.text}>Settings</Text>
        <TouchableOpacity onPress={() => handleNavigation('ProfileScreen')}>
          <ProfileSection showEditIcon={false}></ProfileSection>
        </TouchableOpacity>

        <AccountSection></AccountSection>
        <EventSection></EventSection>
        <InformationSection></InformationSection>
      </ScrollView>
      <FooterNavbar currentRoute={'SettingScreen'}></FooterNavbar>
    </View>
  )
  {
    /*  
   <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{t('Settings')}</Text>
        <View style={styles.content}>
          {loggedUser ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.text}>Change theme:</Text>
                <DarkMode />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[styles.text, {}]}>Change language:</Text>
                <RNPickerSelect
                  onValueChange={(value: any) => changeLanguagePicker(value)}
                  items={[
                    { label: 'English', value: 'en' },
                    { label: 'Română', value: 'ro' },
                  ]}
                  style={{
                    inputIOS: styles.dropdown,
                    inputAndroid: styles.dropdown,
                  }}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <View>
                <SupportTicket onSubmit={handleTicketSubmit} />
              </View>
            </>
          ) : (
            <Text style={styles.noUserText}>{t('No user is logged in')}</Text>
          )}
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={'SettingScreen'} />
    </KeyboardAvoidingView>
  */
  }
}

export default SettingScreen

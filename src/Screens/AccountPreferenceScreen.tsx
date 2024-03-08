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
import RNPickerSelect from 'react-native-picker-select'
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
import AccountPreference from '../Components/SettingSections/AccountPreference'

const AccountPreferenceScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, refreshData } = useUser()
  const { backgroundColor, textColor } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  const changeLanguagePicker = async (lng: string) => {
    const apiUrl = `${config.BASE_URL}/api/UserProfilePreference/${loggedUser?.id}/preferences`

    const requestBody = {
      LanguagePreference: lng,
    }

    try {
      const response = await axios.put(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      showNotificationMessage(
        'User preferences updated successfully',
        'success',
      )
      refreshData()
    } catch (error) {
      showNotificationMessage('Error updating user preferences:', 'fail')
    }
    i18n.changeLanguage(lng)
  }
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
    dropdown: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: textColor,
      paddingRight: 30,
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
        <Text style={styles.text}>Account Preference</Text>

        <AccountPreference></AccountPreference>
      </ScrollView>
      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
}

export default AccountPreferenceScreen

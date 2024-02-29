import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
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

const SettingScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, refreshData } = useUser()
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
  }) => {
    console.log(ticket)
  }

  return (
    <View style={{ flex: 1 }}>
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
              <ChatComponent></ChatComponent>
            </>
          ) : (
            <Text style={styles.noUserText}>{t('No user is logged in')}</Text>
          )}
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={'SettingScreen'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  text: {
    fontSize: 25,
    marginHorizontal: 20,
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
    color: 'black',
    paddingRight: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: '400',
    margin: 20,
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

export default SettingScreen

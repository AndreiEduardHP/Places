import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import i18n from '../TranslationFiles/i18n'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { useNotification } from '../Components/Notification/NotificationProvider'

import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import AccountPreference from '../Components/SettingSections/AccountPreference'

const AccountPreferenceScreen: React.FC = () => {
  const { t } = useTranslation()
  const { backgroundColor, textColor } = useThemeColor()

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
        <Text style={styles.text}>
          {t('accountPreferenceScreen.accountPreference')}
        </Text>

        <AccountPreference></AccountPreference>
      </ScrollView>
      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
}

export default AccountPreferenceScreen

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'

import { useNotification } from '../Components/Notification/NotificationProvider'

import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import ProfileSection from '../Components/SettingSections/ProfileSection'
import InformationSection from '../Components/SettingSections/Information'
import AccountSection from '../Components/SettingSections/AccountSettings'
import EventSection from '../Components/SettingSections/EventSection'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import BackAction from '../Components/Back'

const SettingScreen: React.FC = () => {
  const { t } = useTranslation()
  const { backgroundColor, textColor } = useThemeColor()
  const handleNavigation = useHandleNavigation()

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
      //  marginHorizontal: 20,
      color: textColor,
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
            // justifyContent: 'center',
            alignItems: 'center',
          }}>
          <BackAction
            style={{ backgroundColor: 'white', width: 26, height: 26 }}
          />
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

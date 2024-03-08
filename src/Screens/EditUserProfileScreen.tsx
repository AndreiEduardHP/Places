import { t } from 'i18next'
import React, { useState } from 'react'

import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native'

import FooterNavbar from '../Components/FooterNavbar'
import UserProfileForm from '../Components/UpdateUser'
import { ScrollView } from 'react-native-gesture-handler'
import ProfileSection from '../Components/SettingSections/ProfileSection'
import { useUser } from '../Context/AuthContext'
import { useNotification } from '../Components/Notification/NotificationProvider'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'

const EditUserProfileScreen: React.FC = () => {
  const { loggedUser, refreshData } = useUser()
  const { showNotificationMessage } = useNotification()
  const [currentScreen, setCurrentScreen] = useState('editProfile')
  const { backgroundColor, textColor } = useThemeColor()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 27,
      marginTop: 5,
      marginLeft: 10,
      color: textColor,
    },
  })
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
      keyboardVerticalOffset={64}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.text}>Edit User Profile</Text>
        <ProfileSection showEditIcon={true}></ProfileSection>

        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}></View>

          <UserProfileForm />
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={''} />
    </KeyboardAvoidingView>
  )
}

export default EditUserProfileScreen

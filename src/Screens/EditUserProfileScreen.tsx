import { t } from 'i18next'
import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import FooterNavbar from '../Components/FooterNavbar'
import UserProfileForm from '../Components/UpdateUser'
import { ScrollView } from 'react-native-gesture-handler'
import ProfileSection from '../Components/SettingSections/ProfileSection'

import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import BackAction from '../Components/Back'

const EditUserProfileScreen: React.FC = () => {
  const { backgroundColor, textColor } = useThemeColor()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 28,
      fontWeight: '300',
      color: textColor,
    },
  })
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={25}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BackAction
            style={{
              width: 26,
              height: 26,
            }}></BackAction>
          <Text style={styles.text}>
            {t('editUserProfileScreen.editUserProfile')}
          </Text>
        </View>
        <ProfileSection
          showEditIcon={true}
          showTouchIcon={false}></ProfileSection>

        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}></View>

          <UserProfileForm />
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={''} />
    </KeyboardAvoidingView>
  )
}

export default EditUserProfileScreen

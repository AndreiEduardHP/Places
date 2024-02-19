import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import MapView, { Marker } from 'react-native-maps'
import EventForm from '../Components/EventForm'
import Chat from '../Components/Chat/Chat'

const SettingScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, handleLogout } = useUser()

  return (
    <View style={styles.container}>
      {loggedUser ? (
        <View style={{ flex: 1 }}>
          <Text>SettingScreen</Text>
        </View>
      ) : (
        <Text>No user is logged in</Text>
      )}

      {/* Place FooterNavbar at the bottom */}
      <View style={styles.footer}>
        <FooterNavbar currentRoute={'SettingScreen'} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {},
})

export default SettingScreen

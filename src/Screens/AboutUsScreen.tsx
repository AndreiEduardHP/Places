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
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { useUser } from '../Context/AuthContext'

const AboutUsScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, handleLogout } = useUser()
  return (
    <View>
      <Text>SALUTARE ABOUT SCREEN</Text>
      {loggedUser ? (
        <View>
          <Text>Welcome, {loggedUser.username}</Text>
          <Text>Welcome, {loggedUser.firstName}</Text>
          <Text>Welcome, {loggedUser.lastName}</Text>
          <Text>Welcome, {loggedUser.phoneNumber}</Text>
        </View> // Display logged user's username only if loggedUser is not null
      ) : (
        <Text>No user is logged in</Text> // Optionally handle the case where no user is logged in
      )}
      <View>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  )
}

export default AboutUsScreen

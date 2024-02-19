import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import LogInForm from '../Components/LogInForm'

const LoginScreen: React.FC = () => {
  const { t } = useTranslation()
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LogInForm />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen

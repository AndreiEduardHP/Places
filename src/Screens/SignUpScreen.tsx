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

const SignUpScreen: React.FC = () => {
  const { t } = useTranslation()
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('signUpScreen.signUp')}</Text>
        <SignUpForm />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default SignUpScreen

import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

import LogInForm from '../Components/LogInForm'

const LoginScreen: React.FC = () => {
  const { t } = useTranslation()
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LogInForm />
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen

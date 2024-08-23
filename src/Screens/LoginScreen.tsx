import React from 'react'

import { TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native'

import LogInForm from '../Components/LogInForm'

const LoginScreen: React.FC = () => {
  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <LogInForm />
      </TouchableWithoutFeedback>
    </>
  )
}

export default LoginScreen

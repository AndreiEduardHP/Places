import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'

const SignUpScreen: React.FC = () => {
  const { t } = useTranslation()
  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Image
        source={require('../../assets/authentication.png')}
        style={styles.image}></Image>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text>{t('signUpScreen.signUp')}</Text>
          <SignUpForm />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}
const styles = StyleSheet.create({
  image: {
    zIndex: -1,
    flex: 1,
    // backgroundColor: 'white',
    width: 460,
    height: 410,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
})
export default SignUpScreen

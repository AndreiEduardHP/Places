import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'

const SignUpScreen: React.FC = () => {
  const { t } = useTranslation()
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', flex: 1 }}>
          <Image
            source={require('../../assets/authentication.png')}
            style={styles.image}></Image>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                justifyContent: 'center',
                // marginTop: 20,
              }}>
              <Text
                style={{
                  marginLeft: 30,
                  marginTop: 20,
                  fontSize: 32,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }}>
                {t('signUpScreen.signUp')}
              </Text>
              <SignUpForm />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  image: {
    width: 460,
    height: 410,
    bottom: 0,
    position: 'absolute',
  },
})
export default SignUpScreen

import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native'
import SvgComponent from '../Components/SVG/Logo'
import SignUpForm from '../Components/SignUpFrom'
import { t } from 'i18next'

const SignUpScreen: React.FC = () => {
  const [verificationId, setVerificationId] = useState<any>()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <SvgComponent width={300} height={200} />
          </View>
          <Image
            source={require('../../assets/Untitled.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.formContainer}>
            <View style={styles.formBackground}>
              <View style={styles.scrollViewContent}>
                {!verificationId && (
                  <Text style={styles.signUpText}>
                    {t('signUpScreen.signUp')}
                  </Text>
                )}
                <SignUpForm setVerificationId2={setVerificationId} />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    width: '100%',
    height: 210,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 310,
    position: 'absolute',
    zIndex: 2,
  },
  formContainer: {
    left: 0,
    right: 0,
    flex: 1,
    zIndex: 20,
  },
  formBackground: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  signUpText: {
    marginLeft: 20,
    marginTop: 15,
    fontSize: 32,
    color: 'black',
  },
})

export default SignUpScreen

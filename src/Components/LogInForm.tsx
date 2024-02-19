import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Button,
  ImageBackground,
  Alert,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { UserData } from '../Interfaces/IUserData'
import { t } from 'i18next'
import { validateEmail } from '../Utils.tsx/EmailValidation'
import {
  disabledButtonStyle,
  enabledButtonStyle,
} from '../Utils.tsx/ComponentColors.tsx/ButtonsColor'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import {
  FirebaseRecaptcha,
  FirebaseRecaptchaVerifier,
  FirebaseRecaptchaVerifierModal,
} from 'expo-firebase-recaptcha'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithCredential, PhoneAuthProvider } from 'firebase/auth'
import { useNotification } from './Notification/NotificationProvider'

interface Profile {
  username: string
}

const LogInForm: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [touchedEmail, setTouchedEmail] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const isFormComplete = !phoneNumber
  const [userInfo, setUserInfo] = useState(null)
  const { handleLogin, loggedUser, token } = useUser()
  const [code, setCode] = useState('')
  const recaptchaVerifier = useRef<any>()
  const [verificationId, setVerificationId] = useState<any>()

  const firebaseConfig = {
    apiKey: 'AIzaSyDK6l7L56LB6nkpTnqE_GK_-FqPE55QVUE',
    authDomain: 'places-a28da.firebaseapp.com',
    projectId: 'places-a28da',
    storageBucket: 'places-a28da.appspot.com',
    messagingSenderId: '471105680442',
    appId: '1:471105680442:web:844ff5c1f250a6e9e4b103',
    measurementId: 'G-98XG6SNW8N',
  }
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const phonePrefix = '+4'

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      '145140151681-2uapbmtdam6s26ih13i6048sga58jqla.apps.googleusercontent.com',
    iosClientId:
      '145140151681-gukeedo5oup7a0352e4neq1m04a8vcit.apps.googleusercontent.com',
  })
  const handleNavigation = useHandleNavigation()

  const onLoginPress = async (phoneNumber: string) => {
    sendVerification
    confirmCode
    try {
      await handleLogin(phoneNumber)

      // At this point, if login was successful, loggedUser and token will be updated
      console.log('Logged User:', loggedUser)
      console.log('Token:', token)

      // Redirect to 'DefaultScreen'
      handleNavigation('ProfileScreen') // Replace 'DefaultScreen' with the actual name of your desired screen
    } catch (error) {
      // Handle login error
      console.error('Login Error:', error)
    }
  }

  const sendVerification = async () => {
    const phoneProvider = new PhoneAuthProvider(auth)
    try {
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phonePrefix + phoneNumber,
        recaptchaVerifier.current,
      )
      setVerificationId(verificationId)
      return verificationId // Return verificationId for further processing
    } catch (error) {
      Alert.alert('Send code error')
      throw new Error('Failed to send verification code') // Throw an error to be caught in onLoginPress
    }
  }

  const confirmCode = async () => {
    if (!verificationId) {
      Alert.alert('Verification error', 'No verification ID available')
      return false // Indicate failure
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      await signInWithCredential(auth, credential)

      onLoginPress(phoneNumber)
      return true // Indicate success
    } catch (error) {
      Alert.alert('Authentication error')
      return false // Indicate failure
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/LoginImage.png')}
        style={styles.backgroundImage}>
        <View>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
          {!verificationId && (
            <View>
              <TextInput
                placeholder={t('logInScreen.phoneNumber')}
                value={phoneNumber}
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text)}
                style={styles.input}
              />

              <TouchableOpacity
                style={[
                  styles.touchable,
                  isFormComplete ? disabledButtonStyle : enabledButtonStyle,
                ]}
                onPress={() => sendVerification()}
                disabled={isFormComplete}>
                <Text style={styles.text}>{t('buttssons.logIn')}</Text>
              </TouchableOpacity>

              <Button title="Google" onPress={() => {}} />
            </View>
          )}
          {verificationId && (
            <View>
              <TextInput
                placeholder={t('logInScreen.enterCode')}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={styles.input}
                editable={!!verificationId} // Make it editable only if verificationId is set
              />
              <TouchableOpacity
                style={[
                  styles.touchable,
                  code.length === 6 ? enabledButtonStyle : disabledButtonStyle,
                  // Assuming OTP code is 6 digits
                ]}
                onPress={confirmCode} // Trigger the code confirmation logic
                disabled={code.length !== 6}>
                <Text>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
          {loggedUser?.username !== null ? (
            <Text>{loggedUser?.username}</Text>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
    width: 500,
    height: 360,
    resizeMode: 'cover',
  },
  input: {
    width: 250,
    height: 25,

    margin: 5,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  touchable: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 5,
    height: 25,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    color: 'blue',
  },
})

export default LogInForm

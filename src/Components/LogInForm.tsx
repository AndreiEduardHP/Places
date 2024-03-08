import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  Alert,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { t } from 'i18next'
import { validatePhoneNumber } from '../Utils.tsx/EmailValidation'
import {
  disabledButtonStyle,
  enabledButtonStyle,
} from '../Utils.tsx/ComponentColors.tsx/ButtonsColor'

import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
//import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithCredential, PhoneAuthProvider } from 'firebase/auth'
import LoadingComponent from './Loading/Loading'
import { useNotification } from './Notification/NotificationProvider'

const LogInForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const isFormComplete = validatePhoneNumber(phoneNumber)
  const { handleLogin, loggedUser, token } = useUser()
  const [code, setCode] = useState('')
  const recaptchaVerifier = useRef<any>()
  const [verificationId, setVerificationId] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

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
  // const auth = getAuth(app)
  ////const auth = firebaseAuth.initializeAuth(app, {
  //  persistence: reactNativePersistence(ReactNativeAsyncStorage),
  //})
  const phonePrefix = '+4'

  const { showNotificationMessage } = useNotification()

  const onLoginPress = async (phoneNumber: string) => {
    try {
      await handleLogin(phoneNumber)
      setIsLoading(false)
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  const sendVerification = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/userprofile/checkifphonenumberexists?phoneNumber=${phoneNumber}`,
      )

      if (response.status == 200) {
        try {
          //   const phoneProvider = new PhoneAuthProvider(auth)
          //   const verificationId = await phoneProvider.verifyPhoneNumber(
          //    phonePrefix + phoneNumber,
          //    recaptchaVerifier.current,
          //   )
          setVerificationId(verificationId)
          return verificationId
        } catch (error) {
          showNotificationMessage('Send code error', 'fail')
          throw new Error('Failed to send verification code')
        }
      } else if (response.status === 204) {
        showNotificationMessage('phone not found', 'neutral')
      }
    } catch (error) {
      showNotificationMessage('error', 'fail')
    }
  }

  const confirmCode = async () => {
    if (!verificationId) {
      showNotificationMessage('Verification error', 'fail')
      return false
    }

    try {
      setIsLoading(true)
      const credential = PhoneAuthProvider.credential(verificationId, code)
      // await signInWithCredential(auth, credential)

      onLoginPress(phoneNumber)
    } catch (error) {
      showNotificationMessage('Authentication error', 'fail')
      setIsLoading(false)
      return false
    }
  }

  if (isLoading) {
    return <LoadingComponent />

    // return <Text>sfaasf</Text>
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/LoginImage.png')}
        style={styles.backgroundImage}>
        <View>
          <Text //FirebaseRecaptchaVerifierModal
          //   ref={recaptchaVerifier}
          //   firebaseConfig={firebaseConfig}
          />
          {!verificationId && (
            <View>
              <TextInput
                placeholder={t('logInScreen.phoneNumber')}
                value={phoneNumber}
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      validatePhoneNumber(phoneNumber) && phoneNumber
                        ? 'red'
                        : 'gray',
                  },
                ]}
              />

              <TouchableOpacity
                style={[
                  styles.touchable,
                  isFormComplete ? disabledButtonStyle : enabledButtonStyle,
                ]}
                onPress={() => onLoginPress(phoneNumber)}
                disabled={isFormComplete}>
                <Text style={[styles.text, {}]}>{t('buttons.logIn')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: 'black',
                  alignItems: 'center',
                  borderRadius: 10,
                  height: 40,

                  justifyContent: 'center',
                }}>
                <Text style={{ color: 'white', padding: 3 }}>Google</Text>
              </TouchableOpacity>
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
                <Text style={{ color: 'white' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
    width: 375,
    height: 40,

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
    marginTop: 10,
    backgroundColor: 'blue',
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    height: 40,
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

import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Text,
  ImageBackground,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
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
import { LinearGradient } from 'expo-linear-gradient'
import SvgComponent from './SVG/Logo'

const LogInForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const isFormComplete = validatePhoneNumber(phoneNumber)
  const { handleLogin, loggedUser, token } = useUser()
  const [code, setCode] = useState('')
  const recaptchaVerifier = useRef<any>()
  const [verificationId, setVerificationId] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const handleNavigation = useHandleNavigation()
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
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* <ImageBackground
        source={require('../../assets/LoginImage.png')}
  style={styles.backgroundImage}> */}
        <ImageBackground
          source={require('../../assets/Untitled.png')}
          style={{
            width: '100%',
            height: 370,
            flex: 1,
          }}
          resizeMode="cover"></ImageBackground>
        <LinearGradient
          colors={[
            'rgba(255,255,255,1)',
            'rgba(212,220,222,0.75)',

            'rgba(0,0,0,0.1)',

            'rgba(0,0,0,1)',
          ]} // Start and end colors
          start={{ x: 0, y: 0 }} // Optional gradient direction start point
          end={{ x: 0, y: 1 }} // Optional gradient direction end point
          style={{
            position: 'absolute',
            top: '35%',
            height: '100%',
            alignItems: 'center',
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            paddingTop: 35,
            width: '100%',
            zIndex: 1,
          }}>
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
                onPress={() => onLoginPress(phoneNumber)}
                disabled={isFormComplete}>
                <LinearGradient
                  colors={['#5151C6', '#888BF4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.touchable,
                    isFormComplete
                      ? styles.disabledButtonStyle
                      : styles.enabledButtonStyle,
                  ]}>
                  <Text style={[styles.text, {}]}>{t('buttons.logIn')}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Text style={styles.orLogIn}>OR LOG IN BY</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LinearGradient
                  colors={[
                    'rgba(136, 139, 244, 0.3)',
                    'rgba(81, 81, 198, 0.3)',
                  ]} // Start and end colors of the gradient
                  style={{
                    borderRadius: 50,
                    marginTop: 10,

                    alignItems: 'center',

                    width: 70,
                    height: 70,

                    justifyContent: 'center',
                  }}
                  start={{ x: 0, y: 0 }} // Horizontal gradient
                  end={{ x: 1, y: 0 }}>
                  <TouchableOpacity>
                    <Image
                      source={require('../../assets/Icons/google.png')}
                      style={{
                        width: 45,
                        height: 45,
                      }}
                    />
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={[
                    'rgba(136, 139, 244, 0.3)',
                    'rgba(81, 81, 198, 0.3)',
                  ]} // Start and end colors of the gradient
                  style={{
                    borderRadius: 50,
                    marginTop: 10,

                    alignItems: 'center',

                    width: 70,
                    height: 70,

                    justifyContent: 'center',
                  }}
                  start={{ x: 0, y: 0 }} // Horizontal gradient
                  end={{ x: 1, y: 0 }}>
                  <TouchableOpacity>
                    <Image
                      source={require('../../assets/Icons/facebook1.png')}
                      style={{
                        width: 45,
                        height: 45,
                      }}
                    />
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={[
                    'rgba(136, 139, 244, 0.3)',
                    'rgba(81, 81, 198, 0.3)',
                  ]} // Start and end colors of the gradient
                  style={{
                    borderRadius: 50,
                    marginTop: 10,

                    alignItems: 'center',

                    width: 70,
                    height: 70,

                    justifyContent: 'center',
                  }}
                  start={{ x: 0, y: 0 }} // Horizontal gradient
                  end={{ x: 1, y: 0 }}>
                  <TouchableOpacity>
                    <Image
                      source={require('../../assets/Icons/apple-logo.png')}
                      style={{
                        width: 45,
                        height: 45,
                      }}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <TouchableOpacity
                onPress={() => handleNavigation('SignUp')}
                style={{
                  marginTop: 120,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.bodyText}>Don't have account?</Text>

                <Text style={styles.signUpText}>SIGN UP</Text>
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
                <Text style={{ color: 'white' }}>{t('buttons.confirm')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
        {/*</ImageBackground>*/}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    //alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  disabledButtonStyle: {
    opacity: 0.55,
  },
  enabledButtonStyle: {
    opacity: 1,
  },
  bodyText: {
    // width: 208, // Numeric value, px is assumed
    height: 28, // Numeric value, px is assumed
    //  fontFamily: 'Circular Std', // Make sure the font is available in your project
    fontSize: 26,
    lineHeight: 28, // Calculated as 150% of 16px
    // textAlign: 'center',
    letterSpacing: -0.2, // Negative letter spacing, make sure it looks good on your device
    color: 'white', // Text color
    // The following flex properties may be omitted if not necessary for layout
  },
  signUpText: {
    height: 26, // Numeric value, px is assumed
    fontFamily: 'Circular Std', // Make sure the font is available in your project
    fontSize: 26,
    lineHeight: 28, // Calculated as 150% of 16px
    textAlign: 'center',
    marginLeft: 10,
    letterSpacing: -0.2, // Negative letter spacing, make sure it looks good on your device
    color: '#888BF4', // Text color
    ...Platform.select({
      ios: {
        shadowColor: '#fff', // White shadow color
        shadowOffset: { width: 1, height: 2 }, // Shadow direction and distance
        shadowOpacity: 0.2, // Full color intensity
        shadowRadius: 2, // Blur radius
      },
      android: {
        // Android doesn't support colored shadows natively
        // You might need a workaround like an image or custom drawing
        elevation: 5, // Adds a default black shadow
      },
    }),
  },
  orLogIn: {
    fontFamily: 'Circular Std', // Make sure this font is imported if custom
    fontStyle: 'normal', // Default, usually doesn't need to be set
    fontWeight: '400', // React Native supports 'normal', 'bold', or specific numbers
    fontSize: 25, // Assuming pixels, just the numeric value

    textAlign: 'center', // Supported as-is
    letterSpacing: 2, // Pixels value, but React Native uses density-independent pixels

    color: '#606060', // Hex color, supported as-is
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
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: 375,
    height: 50,
    backgroundColor: '#F3F5F7',
    borderRadius: 30,
    // borderWidth: 1,
    borderColor: 'gray',
  },
  touchable: {
    alignItems: 'center', // Centers content along the cross-axis (default is column)
    justifyContent: 'center', // Centers content along the main-axis
    marginTop: 10, // Margin top
    backgroundColor: 'blue', // Background color (solid color, not gradient)
    borderRadius: 30, // Completely round edges
    paddingHorizontal: 24, // Horizontal padding
    paddingVertical: 14, // Vertical padding
    width: 375, // Fixed width
    height: 50, // Final height as stated
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

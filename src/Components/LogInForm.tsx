import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Text,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native'
import axios from 'axios'
import { t } from 'i18next'
import { validatePhoneNumber } from '../Utils.tsx/EmailValidation'
import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth'
import LoadingComponent from './Loading/Loading'
import { useNotification } from './Notification/NotificationProvider'
import { LinearGradient } from 'expo-linear-gradient'
import { config } from '../config/urlConfig'
import SegmentedCodeInput from './SegmentedInput'
import { Menu, Pressable } from 'native-base'
import getCountryCode from '../Utils.tsx/GetCountryCode'
import { auth, firebaseConfig } from '../Utils.tsx/Firebase'

const countries = [
  { label: 'United States', value: 'usa' },
  { label: 'Romania', value: 'ro' },
]

type CountryCode = 'usa' | 'ro'

const countryData: Record<
  CountryCode,
  { flag: ReturnType<typeof require>; prefix: string }
> = {
  usa: { flag: require('../../assets/flags/usa.png'), prefix: '+1' },
  ro: { flag: require('../../assets/flags/ro.jpg'), prefix: '+40' },
}

const LogInForm: React.FC = () => {
  const { handleLogin } = useUser()
  const [code, setCode] = useState('')
  const recaptchaVerifier = useRef<any>(null)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const handleNavigation = useHandleNavigation()

  const [country, setCountry] = useState<string>('ro')
  const [flagSource, setFlagSource] = useState(countryData.ro.flag) // Default flag
  const [phonePrefix, setPhonePrefix] = useState(countryData.ro.prefix)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const isFormComplete = validatePhoneNumber(phoneNumber)
  // const phonePrefix = '+4'

  const { showNotificationMessage } = useNotification()

  useEffect(() => {
    const fetchCountryCode = async () => {
      const code: any = await getCountryCode()
      const countryInfo = countryData[code as CountryCode]

      if (countryInfo) {
        setCountry(code)
        setFlagSource(countryInfo.flag)
        setPhonePrefix(countryInfo.prefix)
      }
    }

    fetchCountryCode()
  }, [])
  useEffect(() => {
    const originalConsoleError = console.error

    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && /defaultProps/.test(args[0])) {
        return
      }

      originalConsoleError(...args)
    }

    return () => {
      console.error = originalConsoleError
    }
  }, [])

  const onLoginPress = async (phoneNumber: string) => {
    try {
      await handleLogin(0 + phoneNumber)
      setIsLoading(false)
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  const sendVerification = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/userprofile/checkifphonenumberexists?phoneNumber=${0 + phoneNumber}`,
      )

      if (response.status == 200) {
        try {
          const phoneProvider = new PhoneAuthProvider(auth)
          const verificationId = await phoneProvider.verifyPhoneNumber(
            phonePrefix + phoneNumber,
            recaptchaVerifier.current,
          )
          setVerificationId(verificationId)
          return verificationId
        } catch (error) {
          showNotificationMessage('Send code error', 'fail')
          throw new Error('Failed to send verification code')
        }
      } else if (response.status === 204) {
        showNotificationMessage('Phone number not found', 'neutral')
      }
    } catch (error) {
      showNotificationMessage('Error', 'fail')
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
      await signInWithCredential(auth, credential)

      onLoginPress(phoneNumber)
    } catch (error) {
      showNotificationMessage('Authentication error', 'fail')
      setIsLoading(false)
      return false
    }
  }
  const formatPhoneNumber = (phoneNumber: string | any[]) => {
    const lastThreeDigits = phoneNumber.slice(-3)
    const maskedPart = '******'
    return `${maskedPart}${lastThreeDigits}`
  }

  const handleCodeFilled = (filledCode: string) => {
    setCode(filledCode)
    // Handle the filled code here (e.g., verify the code)
  }
  const handleCountryChange = (value: CountryCode) => {
    const countryInfo = countryData[value]
    if (countryInfo) {
      setCountry(value)
      setFlagSource(countryInfo.flag)
      setPhonePrefix(countryInfo.prefix)
    }
  }
  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
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
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
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
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
          {!verificationId && (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: 'rgba(102,102,101,1)',
                  marginBottom: 2,
                }}>
                Your Mobile Number (*)
              </Text>
              <View style={[styles.input, { flexDirection: 'row' }]}>
                <Menu
                  trigger={(triggerProps) => {
                    return (
                      <Pressable
                        {...triggerProps}
                        style={styles.dropdownButton}>
                        <Image
                          source={flagSource}
                          style={styles.dropdownImage}
                        />
                      </Pressable>
                    )
                  }}>
                  {countries.map((country, index) => (
                    <Menu.Item
                      key={index}
                      onPress={() =>
                        handleCountryChange(country.value as CountryCode)
                      }>
                      <View style={styles.dropdownRow}>
                        <Image
                          source={
                            countryData[country.value as CountryCode].flag
                          }
                          style={styles.dropdownImage}
                        />
                        <Text style={[styles.dropdownText]}>
                          {country.label}
                        </Text>
                        <Text>
                          {' '}
                          {countryData[country.value as CountryCode].prefix}
                        </Text>
                      </View>
                    </Menu.Item>
                  ))}
                </Menu>
                <Text
                  style={{
                    textAlignVertical: 'center',
                    lineHeight: Platform.OS === 'ios' ? 26 : 20,
                  }}>
                  {phonePrefix}
                </Text>
                <TextInput
                  placeholder={'721 221 122'}
                  value={phoneNumber}
                  keyboardType="phone-pad"
                  onChangeText={(text) => setPhoneNumber(text)}
                  style={[
                    {
                      borderColor:
                        validatePhoneNumber(phoneNumber) && phoneNumber
                          ? 'red'
                          : 'gray',
                    },
                    { width: '100%', marginLeft: 5 },
                  ]}
                />
              </View>

              <TouchableOpacity
                onPress={sendVerification}
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
                  alignSelf: 'center',
                  width: 280,
                  justifyContent: 'space-between',
                }}>
                <LinearGradient
                  colors={[
                    'rgba(136, 139, 244, 0.3)',
                    'rgba(81, 81, 198, 0.3)',
                  ]}
                  style={{
                    borderRadius: 50,
                    marginTop: 10,
                    alignItems: 'center',
                    width: 70,
                    height: 70,
                    justifyContent: 'center',
                  }}
                  start={{ x: 0, y: 0 }}
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
                  ]}
                  style={{
                    borderRadius: 50,
                    marginTop: 10,
                    alignItems: 'center',
                    width: 70,
                    height: 70,
                    justifyContent: 'center',
                  }}
                  start={{ x: 0, y: 0 }}
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
                  ]}
                  style={{
                    borderRadius: 50,
                    marginTop: 10,
                    alignItems: 'center',
                    width: 70,
                    height: 70,
                    justifyContent: 'center',
                  }}
                  start={{ x: 0, y: 0 }}
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
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={styles.heading}>{t('SMS verification')}</Text>
              <Text style={styles.subHeading}>
                {t(
                  'A text message with a six-digit verification code has been sent to your phone number ending in ',
                )}
                <Text>
                  {phonePrefix}
                  {formatPhoneNumber(phoneNumber)}
                </Text>
              </Text>

              <SegmentedCodeInput
                length={6}
                onCodeFilled={handleCodeFilled}
                editable={!!verificationId}
              />

              <TouchableOpacity
                style={[
                  styles.touchable,
                  code.length === 6
                    ? styles.enabledButton
                    : styles.disabledButton,
                ]}
                onPress={confirmCode}
                disabled={code.length !== 6}>
                <Text style={{ color: 'white' }}>{t('buttons.logIn')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    justifyContent: 'center',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'orange',
  },
  dropdown: {
    width: '80%',
    height: 'auto',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownImage: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    width: 50,
    height: 40,
    margin: 3,
  },
  dropdownButtonText: {
    color: 'black',
    marginLeft: 10,
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
  enabledButton: {
    backgroundColor: 'orange',
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
  disabledButtonStyle: {
    opacity: 0.55,
  },
  enabledButtonStyle: {
    opacity: 1,
  },
  bodyText: {
    height: 28,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: 'white',
  },
  signUpText: {
    height: 26,
    fontSize: 26,
    lineHeight: 28,
    textAlign: 'center',
    marginLeft: 10,
    letterSpacing: -0.2,
    color: '#888BF4',
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  orLogIn: {
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 25,
    textAlign: 'center',
    letterSpacing: 2,
    color: '#606060',
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
    borderRadius: 10,
    borderColor: 'gray',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'orange',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: 375,
    height: 50,
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

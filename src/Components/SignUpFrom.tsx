import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { t } from 'i18next'
import {
  validateEmail,
  validatePhoneNumber,
} from '../Utils.tsx/EmailValidation'

import { useNotification } from './Notification/NotificationProvider'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import TermsAndConditions from './TermsAndConditions'
import * as Notifications from 'expo-notifications'
import { Box, Menu, Pressable } from 'native-base'
import { PaperProvider, TextInput, DefaultTheme } from 'react-native-paper'
import { interests } from '../Utils.tsx/Interests/Interests'
import getCountryCode from '../Utils.tsx/GetCountryCode'
import { CheckBox } from '@rneui/base'
import { LinearGradient } from 'expo-linear-gradient'

import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth'
import SegmentedCodeInput from './SegmentedInput'
import { auth, firebaseConfig } from '../Utils.tsx/Firebase'
import LoadingComponent from './Loading/Loading'

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

export const theme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    placeholder: 'gray',
    primaryContainer: 'black',
    secondary: 'black',
    background: 'white',
    onSurfaceVariant: 'black',
    card: 'black',
    text: 'black',
    notification: 'black',
  },
}
interface SignUpFormProps {
  setVerificationId2: (verificationId: string | null) => void
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setVerificationId2 }) => {
  const [imageUrl] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [country, setCountry] = useState<string>('ro')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [isPickerVisible, setPickerVisible] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [flagSource, setFlagSource] = useState(countryData.usa.flag)
  const [phonePrefix, setPhonePrefix] = useState(countryData.ro.prefix)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [code, setCode] = useState('')

  const recaptchaVerifier = useRef<any>(null)

  const foundCountry = countries.find((c) => c.value === country)

  const isFormComplete: boolean =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    selectedInterests.length >= 1 &&
    termsAccepted &&
    validatePhoneNumber(0 + phoneNumber)

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

  const checkIfPhoneAndEmailExist = async () => {
    try {
      const phoneResponse = axios.get(
        `${config.BASE_URL}/api/userprofile/checkifphonenumberexists?phoneNumber=${0 + phoneNumber}`,
      )
      const emailResponse = axios.get(
        `${config.BASE_URL}/api/userprofile/checkifemailexists?email=${email ? email : '-'}`,
      )

      const [phoneResult, emailResult] = await Promise.all([
        phoneResponse,
        emailResponse,
      ])

      if (phoneResult.status === 200) {
        showNotificationMessage('Phone number already exists', 'fail')
      } else if (emailResult.status === 200) {
        showNotificationMessage('Email already exists', 'fail')
      } else if (phoneResult.status === 204 && emailResult.status === 204) {
        sendVerification()
      }
    } catch (error) {
      showNotificationMessage('Error occurred during verification', 'fail')
      console.error(error)
    }
  }

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth)
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phonePrefix + phoneNumber,
        recaptchaVerifier.current,
      )
      setVerificationId(verificationId)
      setVerificationId2(verificationId)
    } catch (error) {
      showNotificationMessage('Send code error', 'fail')
      throw new Error('Failed to send verification code')
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
      submitUserProfile()
    } catch (error) {
      showNotificationMessage('Authentication error', 'fail')
      setIsLoading(false)
      return false
    }
  }

  const submitUserProfile = async () => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    }

    var userData = {
      imageUrl: imageUrl,
      firstName: firstName,
      lastName: lastName,
      username: firstName + ' ' + lastName.charAt(0),
      phoneNumber: 0 + phoneNumber,
      email: email != '' ? email : '-',
      city: city != '' ? city : '-',
      interest: selectedInterests.join(',') ?? '-',
      country: foundCountry?.label ?? '-',
      themeColor: 'dark',
      description: '-',
      languagePreference: 'en',
      notificationToken: (await Notifications.getExpoPushTokenAsync()).data,
    }

    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/UserProfile?locationId=${1}`,
        userData,
        axiosConfig,
      )
      handleNavigation('LoginScreen')

      if (email != '') {
        try {
          await axios.post(
            `${config.BASE_URL}/api/userprofile/send/email/${response.data.userProfileId}`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          showNotificationMessage(
            'Verification email sent successfully',
            'success',
          )
        } catch (error) {
          console.error(error)
          showNotificationMessage('Failed to send verification email', 'fail')
        }
      }
      showNotificationMessage(
        'Account successfully created! Proceed to log in!',
        'success',
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleSelectInterest = (interest: any) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest),
      )
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleCountryChange = (value: CountryCode) => {
    const countryInfo = countryData[value]
    if (countryInfo) {
      setCountry(value)
      setFlagSource(countryInfo.flag)
      setPhonePrefix(countryInfo.prefix)
    }
  }

  const handleCodeFilled = (filledCode: string) => {
    setCode(filledCode)
  }

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        {!verificationId && (
          <>
            <View>
              <TextInput
                mode="outlined"
                label={' ' + '*' + ' ' + t('signUpScreen.firstName')}
                placeholder={t('signUpScreen.firstName')}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                style={styles.input}
                placeholderTextColor={theme.colors.text}
                textColor={theme.colors.text}
                cursorColor={theme.colors.text}
                outlineColor={theme.colors.text}
                selectionColor={theme.colors.text}
              />

              <TextInput
                mode="outlined"
                label={' ' + '*' + ' ' + t('signUpScreen.lastName')}
                placeholder={t('signUpScreen.lastName')}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                style={styles.input}
                placeholderTextColor={theme.colors.text}
                textColor={theme.colors.text}
                cursorColor={theme.colors.text}
                outlineColor={theme.colors.text}
                selectionColor={theme.colors.text}
              />

              <TextInput
                mode="outlined"
                label={t('signUpScreen.email')}
                placeholder={t('signUpScreen.email')}
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                }}
                style={[
                  styles.input,
                  {
                    borderColor: validateEmail(email)
                      ? theme.colors.text
                      : 'red',
                  },
                ]}
                placeholderTextColor={theme.colors.text}
                textColor={theme.colors.text}
                cursorColor={theme.colors.text}
                outlineColor={
                  validateEmail(email ?? '') ? theme.colors.text : 'red'
                }
                selectionColor={theme.colors.text}
              />

              <TextInput
                mode="outlined"
                label={t('signUpScreen.city')}
                placeholder={t('signUpScreen.city')}
                value={city}
                onChangeText={(text) => setCity(text)}
                style={styles.input}
                placeholderTextColor={theme.colors.text}
                textColor={theme.colors.text}
                cursorColor={theme.colors.text}
                outlineColor={theme.colors.text}
                selectionColor={theme.colors.text}
              />

              <Modal
                animationType="slide"
                transparent={true}
                visible={isPickerVisible}
                onRequestClose={() => setPickerVisible(false)}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={{ fontSize: 24, marginBottom: 20 }}>
                      {t('signUpScreen.selectMinimumOneInterest')}
                    </Text>
                    <ScrollView>
                      {interests.map((interest, index) => (
                        <View key={index} style={styles.checkboxContainer}>
                          <CheckBox
                            onPress={() => handleSelectInterest(interest)}
                            title={interest}
                            checked={selectedInterests.includes(interest)}
                          />
                        </View>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'black',
                        borderRadius: 10,
                        width: 80,
                        alignItems: 'center',
                      }}
                      onPress={() => setPickerVisible(false)}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 18,
                          padding: 5,
                        }}>
                        {t('buttons.save')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <Box w="100%" alignItems="center" style={{ marginTop: 6 }}>
              <Menu
                trigger={(triggerProps) => {
                  return (
                    <Pressable {...triggerProps} style={styles.dropdownButton}>
                      <Image source={flagSource} style={styles.dropdownImage} />
                      <Text style={styles.dropdownButtonText}>
                        {countries.find((c) => c.value === country)?.label ||
                          'Select a country...'}
                      </Text>
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
                        source={countryData[country.value as CountryCode].flag}
                        style={styles.dropdownImage}
                      />
                      <Text style={styles.dropdownText}>{country.label}</Text>
                    </View>
                  </Menu.Item>
                ))}
              </Menu>
            </Box>
            <View
              style={[
                {
                  flexDirection: 'row',
                  width: 375,
                  height: 40,
                  margin: 4,
                  borderRadius: 10,
                  borderColor:
                    validatePhoneNumber(phoneNumber) && phoneNumber
                      ? 'red'
                      : 'black',
                  borderWidth: 1,
                  alignItems: 'center',
                  paddingHorizontal: 15,
                },
              ]}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={flagSource}
                  style={{ width: 40, height: 30 }}></Image>
                <Text style={{ paddingTop: 6, paddingLeft: 5, color: 'black' }}>
                  {phonePrefix}
                </Text>
              </View>

              <TextInput
                placeholder={
                  ' ' +
                  '*' +
                  ' ' +
                  t('signUpScreen.phoneNumber') +
                  ' ' +
                  '(721006612)'
                }
                contentStyle={{ fontSize: 14, width: 300 }}
                value={phoneNumber}
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text)}
                style={[
                  {
                    marginLeft: 10,
                    backgroundColor: 'transparent',
                  },
                ]}
                activeUnderlineColor="transparent"
                underlineColor="transparent"
              />
            </View>
            <TouchableWithoutFeedback
              style={styles.inputInterest}
              onPress={() => setPickerVisible(true)}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#266EC3',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  {'*'} {t('eventForm.selectedInterest')}: {''}
                  <Text style={{ color: 'black' }}>
                    {selectedInterests.join(', ') || ' Select Interest'}
                  </Text>
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ alignItems: 'center' }}>
              {selectedInterests.length > 0 ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 5,
                    paddingHorizontal: 7,
                    color: 'black',
                  }}>
                  {t('signUpScreen.noteSelections')}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 0,
              }}>
              <TermsAndConditions
                textColor="black"
                accepted={termsAccepted}
                onToggle={() => setTermsAccepted(!termsAccepted)}
              />

              <LinearGradient
                colors={['#5151C6', '#888BF4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.touchable,
                  !isFormComplete ? { opacity: 0.5 } : { opacity: 1 },
                ]}>
                <TouchableOpacity
                  onPress={() => checkIfPhoneAndEmailExist()}
                  disabled={!isFormComplete}>
                  <Text style={[styles.text, {}]}>{t('buttons.signUp')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </>
        )}
        {verificationId && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 50,
              //justifyContent: 'center',
            }}>
            <Text style={styles.heading}>{t('SMS verification')}</Text>
            <Text style={styles.subHeading}>
              {t(
                'A text message with a six-digit verification code has been sent to your phone number ending in ',
              )}
              <Text>
                {phonePrefix}******{phoneNumber.slice(-3)}
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
              <Text style={{ color: 'white', fontSize: 20 }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  label: {},
  inputInterest: {
    justifyContent: 'center',
    width: 375,
    height: 40,
    margin: 4,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  centeredView: {
    flex: 1,
    width: '100%',
    height: 650,
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    justifyContent: 'center',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: 600,
  },
  picker: {
    width: 300,
    height: 200,
  },
  input: {
    width: 375,
    marginTop: 4,
  },
  touchable: {
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 7,
    marginTop: 20,
  },
  text: {
    color: 'white',
    fontSize: 22,
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 2,
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
    width: 40,
    height: 30,
    marginRight: 0,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 375,
    height: 40,
    margin: 4,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  dropdownButtonText: {
    color: 'black',
    marginLeft: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'orange',
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
})

export default SignUpForm

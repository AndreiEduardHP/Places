import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { t } from 'i18next'
import {
  validateEmail,
  validatePhoneNumber,
} from '../Utils.tsx/EmailValidation'
import {
  disabledButtonStyle,
  enabledButtonStyle,
} from '../Utils.tsx/ComponentColors.tsx/ButtonsColor'
import { useNotification } from './Notification/NotificationProvider'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import TermsAndConditions from './TermsAndConditions'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Checkbox from 'expo-checkbox'
import * as Notifications from 'expo-notifications'
import { Box, Button, Menu, Pressable } from 'native-base'
import { PaperProvider, TextInput, DefaultTheme } from 'react-native-paper'
import { background } from 'native-base/lib/typescript/theme/styled-system'
import { interests } from '../Utils.tsx/Interests/Interests'
import getCountryCode from '../Utils.tsx/GetCountryCode'
import { red100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors'
import { CheckBox } from '@rneui/base'

const countries = [
  { label: 'United States', value: 'usa' },
  { label: 'Romania', value: 'ro' },
]

type CountryCode = 'usa' | 'ro' // Add more country codes as needed

const countryData: Record<
  CountryCode,
  { flag: ReturnType<typeof require>; prefix: string }
> = {
  usa: { flag: require('../../assets/flags/usa.png'), prefix: '+1' },
  ro: { flag: require('../../assets/flags/ro.jpg'), prefix: '+40' },
  // Add other countries with their flags and prefixes here
}

const theme = {
  ...DefaultTheme,
  roundness: 16,
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

const SignUpForm: React.FC = () => {
  const [imageUrl] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [country, setCountry] = useState<string>('ro')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [interest, setInterest] = useState<string>('')
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [isPickerVisible, setPickerVisible] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [flagSource, setFlagSource] = useState(countryData.usa.flag) // Default flag
  const [phonePrefix, setPhonePrefix] = useState(countryData.ro.prefix)
  const foundCountry = countries.find((c) => c.value === country)

  const isFormComplete =
    // !email ||
    !phoneNumber ||
    !firstName ||
    !lastName ||
    // !city ||
    // selectedInterests.length === 0 ||
    !termsAccepted ||
    // !validateEmail(email) ||
    validatePhoneNumber(phoneNumber)

  useEffect(() => {
    const fetchCountryCode = async () => {
      const code: any = await getCountryCode()
      const countryInfo = countryData[code as CountryCode]
      console.log('sign up' + code)
      if (countryInfo) {
        setCountry(code)
        setFlagSource(countryInfo.flag)
        setPhonePrefix(countryInfo.prefix)
      }
    }

    fetchCountryCode()
  }, [])

  const checkIfPhoneExists = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/userprofile/checkifphonenumberexists?phoneNumber=${phoneNumber}`,
      )
      if (response.status == 200) {
        showNotificationMessage('Phone number already exists', 'fail')
      } else if (response.status == 204) {
        submitUserProfile()
      }
    } catch (error) {}
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
      console.log(flagSource)
      setPhonePrefix(countryInfo.prefix)
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
      interest: selectedInterests.join(';') ?? '-',
      country: foundCountry?.label ?? '-',
      themeColor: 'dark',
      languagePreference: 'en',
      notificationToken: (await Notifications.getExpoPushTokenAsync()).data,
    }
    console.log(userData.username)

    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/UserProfile?locationId=${1}`,
        userData,
        axiosConfig,
      )
      handleNavigation('LoginScreen')
      showNotificationMessage(
        'Account successfully created! Proceed to log in!',
        'success',
      )
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        <View>
          {/* <Text style={styles.title}>{t('signUpScreen.firstName')}:</Text>*/}
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

          {/* <Text style={styles.title}>{t('signUpScreen.lastName')}:</Text>*/}
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

          {/*   <Text style={styles.title}>{t('signUpScreen.username')}:</Text>
          <TextInput
            mode="outlined"
            label={t('signUpScreen.username')}
            placeholder={t('signUpScreen.username')}
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={styles.input}
            placeholderTextColor={theme.colors.text}
            textColor={theme.colors.text}
            cursorColor={theme.colors.text}
            outlineColor={theme.colors.text}
            selectionColor={theme.colors.text}
          />*/}

          {/*  <Text style={styles.title}>{t('signUpScreen.email')}:</Text> */}
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
                borderColor: validateEmail(email) ? theme.colors.text : 'red',
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

          {/* <Text style={styles.title}>{t('signUpScreen.country')}:</Text> */}

          {/*  <Text style={styles.title}>{t('signUpScreen.phoneNumber')}:</Text> */}

          {/* <Text style={styles.title}>{t('signUpScreen.city')}:</Text> */}
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

          {/*  <Text style={styles.title}>{t('signUpScreen.interest')}:</Text> */}
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
                        ///   style={styles.checkbox}
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
        <Box w="100%" alignItems="center" style={{ marginTop: 15 }}>
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
          <View>
            <Text numberOfLines={2} style={{ color: '#266EC3' }}>
              Selected interest:
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
            marginTop: 30,
          }}>
          <TermsAndConditions
            textColor="black"
            accepted={termsAccepted}
            onToggle={() => setTermsAccepted(!termsAccepted)}
          />

          <TouchableOpacity
            style={[
              styles.touchable,
              isFormComplete
                ? disabledButtonStyle
                : { backgroundColor: '#266EC3' },
            ]}
            onPress={() => checkIfPhoneExists()}
            disabled={isFormComplete}>
            <Text style={styles.text}>{t('buttons.signUp')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    //  width: '100%',
    //height: '90%',
    // borderColor: 'black',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    //padding: 2,
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
    //  marginBottom: 10,
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
    // elevation: 5,
  },
  picker: {
    width: 300,
    height: 200,
  },
  input: {
    //  color: 'black',
    width: 375,
    //height: 35,
    marginTop: 5,
    //  borderRadius: 10,
    //  borderColor: 'black',
    //  borderWidth: 1,
    // paddingHorizontal: 15,
  },
  touchable: {
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
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
})

export default SignUpForm

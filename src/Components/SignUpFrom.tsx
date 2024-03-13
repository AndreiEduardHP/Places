import { useEffect, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Text,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import RNPickerSelect from 'react-native-picker-select'
import Picker from 'react-native-picker-select'
import * as Notifications from 'expo-notifications'

const interests = [
  'Travel and Adventure',
  'Music',
  'Food and Cooking',
  'Sports and Fitness',
  'Technology and Gadgets',
  'Reading and Literature',
  'Gaming and eSports',
  'Movies and Television',
  'Art and Culture',
  'Nature and Environment',
  'Science and Space',
  'Fashion and Beauty',
  'Photography and Videography',
  'Social Media and Blogging',
  'Health and Wellness',
  'Business and Entrepreneurship',
]
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

const SignUpForm: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [interest, setInterest] = useState<string>('')
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [isPickerVisible, setPickerVisible] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [flagSource, setFlagSource] = useState(countryData.ro.flag) // Default flag
  const [phonePrefix, setPhonePrefix] = useState(countryData.ro.prefix)
  const foundCountry = countries.find((c) => c.value === country)

  const isFormComplete =
    !email ||
    !phoneNumber ||
    !firstName ||
    !lastName ||
    !city ||
    selectedInterests.length === 0 ||
    !termsAccepted ||
    !validateEmail(email) ||
    validatePhoneNumber(phoneNumber)

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
      setPhonePrefix(countryInfo.prefix)
    }
  }
  useEffect(() => {
    console.log(foundCountry?.label) // This will log the found country object, or undefined if not found
  }, [country])

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
      username: username,
      phoneNumber: phoneNumber,
      email: email,
      city: city,
      interest: selectedInterests.join(';'),
      country: foundCountry?.label,
      themeColor: 'dark',
      languagePreference: 'en',
      notificationToken: (await Notifications.getExpoPushTokenAsync()).data,
    }
    console.log(userData)
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
    } catch (err) {}
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{t('signUpScreen.lastName')}:</Text>
        <TextInput
          placeholder={t('signUpScreen.firstName')}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          style={styles.input}
        />

        <Text style={styles.title}>{t('signUpScreen.lastName')}:</Text>
        <TextInput
          placeholder={t('signUpScreen.lastName')}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          style={styles.input}
        />

        <Text style={styles.title}>{t('signUpScreen.username')}:</Text>
        <TextInput
          placeholder={t('signUpScreen.username')}
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />

        <Text style={styles.title}>{t('signUpScreen.email')}:</Text>
        <TextInput
          placeholder={t('signUpScreen.email')}
          value={email}
          onChangeText={(text) => {
            setEmail(text)
          }}
          style={[
            styles.input,
            { borderColor: validateEmail(email) ? 'gray' : 'red' },
          ]}
        />

        <Text style={styles.title}>{t('signUpScreen.country')}:</Text>
        <RNPickerSelect
          onValueChange={(value) => handleCountryChange(value as CountryCode)}
          items={countries}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Select a country...',
            value: null,
          }}
          value={country}
        />

        <Text style={styles.title}>{t('signUpScreen.phoneNumber')}:</Text>
        <View
          style={[
            {
              flexDirection: 'row',
              width: 375,
              height: 40,
              margin: 7,
              borderRadius: 10,
              borderColor: 'gray',
              borderWidth: 1,
              alignItems: 'center',
              paddingHorizontal: 5,
            },
          ]}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={flagSource}
              style={{ width: 40, height: 30 }}></Image>
            <Text style={{ paddingTop: 6, paddingLeft: 5 }}>{phonePrefix}</Text>
          </View>

          <TextInput
            placeholder={t('signUpScreen.phoneNumber')}
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(text) => setPhoneNumber(text)}
            style={[
              {
                marginLeft: 10,
                borderColor:
                  validatePhoneNumber(phoneNumber) && phoneNumber
                    ? 'red'
                    : 'grey',
              },
            ]}
          />
        </View>

        <Text style={styles.title}>{t('signUpScreen.city')}:</Text>
        <TextInput
          placeholder={t('signUpScreen.city')}
          value={city}
          onChangeText={(text) => setCity(text)}
          style={styles.input}
        />

        <Text style={styles.title}>{t('signUpScreen.interest')}:</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isPickerVisible}
          onRequestClose={() => setPickerVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontSize: 24, marginBottom: 20 }}>
                Select minimum one interest
              </Text>
              <ScrollView>
                {interests.map((interest, index) => (
                  <View key={index} style={styles.checkboxContainer}>
                    <Checkbox
                      value={selectedInterests.includes(interest)}
                      onValueChange={() => handleSelectInterest(interest)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.label}>{interest}</Text>
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
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableWithoutFeedback
          style={styles.inputInterest}
          onPress={() => setPickerVisible(true)}>
          <View>
            <Text numberOfLines={2}>
              {'Selected interest: ' + (selectedInterests || 'Select Interest')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ alignItems: 'center' }}>
          {selectedInterests.length > 0 ? (
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                marginTop: 10,
              }}>
              Note: these selections will drive the entire Places experience and
              is important to select only the relevant one's !
            </Text>
          ) : null}
        </View>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TermsAndConditions
          accepted={termsAccepted}
          onToggle={() => setTermsAccepted(!termsAccepted)}
        />

        <TouchableOpacity
          style={[
            styles.touchable,
            isFormComplete ? disabledButtonStyle : enabledButtonStyle,
          ]}
          onPress={() => checkIfPhoneExists()}
          disabled={isFormComplete}>
          <Text style={styles.text}>{t('buttons.signUp')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    justifyContent: 'center',
    width: 375,
    height: 40,
    margin: 5,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  inputAndroid: {
    justifyContent: 'center',
    width: 375,
    height: 40,
    margin: 5,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  // Add other style keys as needed
})

const styles = StyleSheet.create({
  container: {
    //  width: '100%',
    height: '90%',
    borderColor: 'black',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',

    alignItems: 'center',
    padding: 20,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 8,
  },
  label: {},

  inputInterest: {
    justifyContent: 'center',
    width: 375,
    height: 40,
    margin: 5,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },

  centeredView: {
    flex: 1,
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
    // elevation: 5,
  },
  picker: {
    width: 300,
    height: 200,
  },
  input: {
    width: 375,
    height: 40,
    margin: 7,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  touchable: {
    borderRadius: 10,
    backgroundColor: 'blue',
    paddingHorizontal: 20,

    paddingVertical: 7,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 2,
  },
})

export default SignUpForm

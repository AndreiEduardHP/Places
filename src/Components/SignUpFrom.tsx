import { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { UserData } from '../Interfaces/IUserData'
import { t } from 'i18next'
import {
  validateEmail,
  validatePhoneNumber,
} from '../Utils.tsx/EmailValidation'
import {
  disabledButtonStyle,
  enabledButtonStyle,
} from '../Utils.tsx/ComponentColors.tsx/ButtonsColor'
import Notification from './Notification/Notifications'
import { useNotification } from './Notification/NotificationProvider'

const SignUpForm: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [touchedEmail, setTouchedEmail] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [interest, setInterest] = useState<string>('')
  const { showNotificationMessage } = useNotification()
  const isFormComplete =
    !email ||
    !phoneNumber ||
    !firstName ||
    !lastName ||
    !city ||
    !interest ||
    !validateEmail(email) ||
    !validatePhoneNumber(phoneNumber)

  const userData: UserData = {
    imageUrl: imageUrl,
    firstName: firstName,
    lastName: lastName,
    username: username,
    phoneNumber: phoneNumber,
    email: email,
    city: city,
    interest: interest,
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
      username: username,
      phoneNumber: phoneNumber,
      email: email,
      city: city,
      interest: interest,
    }

    //console.log(userData);
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/UserProfile?locationId=${1}`,
        userData,
        axiosConfig,
      )
      console.log(response.data)
      //  navigation.replace('DrawerNav');
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Image URL(optional)"
        value={imageUrl}
        onChangeText={(text) => setImageUrl(text)}
        style={styles.input}
      />

      <TextInput
        placeholder={t('signUpScreen.firstName')}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        style={styles.input}
      />

      <TextInput
        placeholder={t('signUpScreen.lastName')}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        style={styles.input}
      />

      <TextInput
        placeholder={t('signUpScreen.username')}
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />

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

      <TextInput
        placeholder={t('signUpScreen.phoneNumber')}
        value={phoneNumber}
        keyboardType="phone-pad"
        onChangeText={(text) => setPhoneNumber(text)}
        style={[
          styles.input,
          { borderColor: validatePhoneNumber(phoneNumber) ? 'gray' : 'red' },
        ]}
      />

      <TextInput
        placeholder={t('signUpScreen.city')}
        value={city}
        onChangeText={(text) => setCity(text)}
        style={styles.input}
      />

      <TextInput
        placeholder={t('signUpScreen.interest')}
        value={interest}
        onChangeText={(text) => setInterest(text)}
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.touchable,
          isFormComplete ? disabledButtonStyle : enabledButtonStyle,
        ]}
        onPress={() => submitUserProfile()}
        disabled={isFormComplete}>
        <Text style={styles.text}>{t('buttons.signUp')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.touchable,
          isFormComplete ? disabledButtonStyle : enabledButtonStyle,
        ]}
        onPress={() =>
          showNotificationMessage(
            'User profile submitted successfully!',
            'success',
          )
        }>
        <Text style={styles.text}>notify</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '50%',
    height: 28,
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

    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    color: 'blue',
  },
})

export default SignUpForm

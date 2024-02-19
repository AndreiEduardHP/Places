import { useEffect, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Button,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { EventData, UserData } from '../Interfaces/IUserData'
import { t } from 'i18next'
import { validateEmail } from '../Utils.tsx/EmailValidation'
import {
  disabledButtonStyle,
  enabledButtonStyle,
} from '../Utils.tsx/ComponentColors.tsx/ButtonsColor'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import { ImageConfig } from '../config/imageConfig'

interface EditFormProps {
  latitude?: number // Optional number type for latitude
  longitude?: number // Optional number type for longitude
}

const EditForm: React.FC<EditFormProps> = ({ latitude, longitude }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventImage: '',
    eventTime: '',
    locationLatitude: latitude ? latitude.toString() : '', // Set latitude if provided, otherwise empty string
    locationLongitude: longitude ? longitude.toString() : '', // Set longitude if provided, otherwise empty string
    maxParticipants: '',
  })
  const [date, setDate] = useState(new Date('2024-02-09T00:50:00+00:00'))

  const [eventImg, setEventImg] = useState<any>()

  const isFormComplete = true

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate

    setDate(currentDate)
    handleChange('eventTime', date)
  }
  useEffect(() => {
    console.log(formData) // This will log formData every time it changes
  }, [formData]) //

  const handleChange = (name: any, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    })

    if (!result.canceled && result.assets) {
      // Use the first selected image
      const image = result.assets[0]
      await setEventImg(image.base64)

      await handleChange('eventImage', image.base64)
      //  await console.log(formData.eventImage)

      // Replace '2' with the actual userProfileId
    } else {
      console.log('Image picking was cancelled or failed')
    }
  }

  const createEvent = async () => {
    console.log(latitude, longitude)
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/Event`,
        formData,
        {
          headers: {},
        },
      )

      if (response.status === 200) {
        console.log('Image uploaded successfully')
      } else {
        console.error('Image upload failed')
      }
    } catch (error) {
      console.error('Network error:', error)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          placeholder="Event Name"
          value={formData.eventName}
          onChangeText={(text) => handleChange('eventName', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Event Description"
          value={formData.eventDescription}
          onChangeText={(text) => handleChange('eventDescription', text)}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => {
            selectImage()
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{
                width: 24,
                height: 24,
                marginRight: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={require('../../assets/Icons/edit.png')}
            />
            <Text>Upload</Text>
          </View>
        </TouchableOpacity>

        <Image
          source={{ uri: ImageConfig.IMAGE_CONFIG + eventImg }}
          style={{ width: 100, height: 100 }} // Set the desired image dimensions
        />
        <TextInput
          placeholder="Event Max Participants"
          value={formData.maxParticipants}
          onChangeText={(text) => handleChange('maxParticipants', text)}
          style={styles.input}
          keyboardType="numeric"
        />
        <View style={{ flexDirection: 'row' }}>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChange}
          />
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="time"
            is24Hour={true}
            onChange={onChange}
          />
        </View>
        {formData.eventTime ? (
          <Text>Selected date and time: {date.toLocaleString()}</Text>
        ) : null}
        <TouchableOpacity
          style={[
            styles.touchable,
            isFormComplete ? disabledButtonStyle : enabledButtonStyle,
          ]}
          onPress={() => createEvent()}>
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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

export default EditForm

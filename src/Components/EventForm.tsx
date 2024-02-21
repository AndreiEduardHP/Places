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
import { useNotification } from './Notification/NotificationProvider'

interface EditFormProps {
  latitude?: number // Optional number type for latitude
  longitude?: number // Optional number type for longitude
  onEventAdded?: () => void
  setAddNewEvent: React.Dispatch<React.SetStateAction<boolean>> // Add this prop
}

const EditForm: React.FC<EditFormProps> = ({
  latitude,
  longitude,
  onEventAdded,
  setAddNewEvent,
}) => {
  const [date, setDate] = useState(new Date('2024-02-09T00:50:00+00:00'))
  const { showNotificationMessage } = useNotification()
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventImage: '',
    eventTime: date.toLocaleString(),
    locationLatitude: latitude ? latitude.toString() : '', // Set latitude if provided, otherwise empty string
    locationLongitude: longitude ? longitude.toString() : '', // Set longitude if provided, otherwise empty string
    maxParticipants: '',
  })

  const [eventImg, setEventImg] = useState<any>()

  const isFormComplete = true

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate

    setDate(currentDate)
    handleChange('eventTime', date)
  }

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
    } else {
      console.log('Image picking was cancelled or failed')
    }
  }

  const createEvent = async () => {
    console.log(latitude, longitude)

    formData.eventTime = new Date().toISOString()

    console.log(formData.eventTime)
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
        setAddNewEvent(false) // Close the bottom drawer when event is added
        showNotificationMessage('Event added succesfully', 'success')
        if (typeof onEventAdded === 'function') {
          onEventAdded()
        }
      } else {
        showNotificationMessage('Something went wrong', 'fail')
      }
    } catch (error) {
      showNotificationMessage('Something went wrong', 'fail')
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

        <TextInput
          placeholder="Event Max Participants"
          value={formData.maxParticipants}
          onChangeText={(text) => handleChange('maxParticipants', text)}
          style={styles.input}
          keyboardType="numeric"
        />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'grey',
            borderRadius: 10,
          }}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            is24Hour={true}
            onChange={onChange}
          />
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="time"
            is24Hour={true}
            onChange={onChange}
            style={{}}
          />
        </View>
        {formData.eventTime ? (
          <Text>Selected date and time: {date.toLocaleString()}</Text>
        ) : (
          <Text> {date.toLocaleString()} </Text>
        )}
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
        <TouchableOpacity
          style={[
            styles.touchable,
            isFormComplete ? disabledButtonStyle : enabledButtonStyle,
            { width: 125, marginTop: 10 },
          ]}
          onPress={createEvent}>
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
    height: 25,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
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

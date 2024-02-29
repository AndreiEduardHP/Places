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
import Checkbox from 'expo-checkbox'
import { useUser } from '../Context/AuthContext'

interface EditFormProps {
  latitude?: number
  longitude?: number
  onEventAdded?: () => void
  setAddNewEvent: React.Dispatch<React.SetStateAction<boolean>>
}

const EditForm: React.FC<EditFormProps> = ({
  latitude,
  longitude,
  onEventAdded,
  setAddNewEvent,
}) => {
  const [date, setDate] = useState(new Date('2024-02-09T00:50:00+00:00'))
  const { loggedUser, refreshData } = useUser()
  const { showNotificationMessage } = useNotification()
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventImage: '',
    eventTime: new Date(),
    locationLatitude: latitude ? latitude.toString() : '',
    locationLongitude: longitude ? longitude.toString() : '',
    maxParticipants: '',
    createdByUserId: loggedUser?.id,
  })

  const [eventImg, setEventImg] = useState<any>()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const [formComplete, setFormComplete] = useState<boolean>(false)

  useEffect(() => {
    const { eventName, eventDescription, maxParticipants } = formData
    const isComplete =
      eventName.trim() !== '' &&
      eventDescription.trim() !== '' &&
      maxParticipants.trim() !== ''
    setFormComplete(isComplete)
  }, [formData])

  const formatDateAndTime = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0') // Add leading 0 if day is less than 10
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed, add leading 0 if month is less than 10
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0') // Add leading 0 if hours are less than 10
    const minutes = date.getMinutes().toString().padStart(2, '0') // Add leading 0 if minutes are less than 10

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false)
    const currentTime = selectedTime || date
    setDate(
      new Date(date.setHours(currentTime.getHours(), currentTime.getMinutes())),
    )
  }
  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date
    setShowDatePicker(false)
    setDate(currentDate)
    console.log(date)
    setShowTimePicker(true)
  }

  const showDatepicker = () => {
    setShowDatePicker(true)
  }

  const showTimepicker = () => {
    setShowTimePicker(true)
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
      const image = result.assets[0]
      await setEventImg(image.base64)

      await handleChange('eventImage', image.base64)
    } else {
      showNotificationMessage(
        'Image picking was cancelled or failed',
        'neutral',
      )
    }
  }

  const createEvent = async () => {
    formData.eventTime = date

    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/Event`,
        formData,
        {
          headers: {},
        },
      )

      if (response.status === 200) {
        showNotificationMessage('Image uploaded successfully', 'success')
        setAddNewEvent(false)
        showNotificationMessage('Event added successfully', 'success')

        // Deduct credit after event creation
        try {
          await axios.post(
            `${config.BASE_URL}/api/UserProfile/DeductCredit/${loggedUser?.id}`, // Assuming you have the userId available
            {},
            {
              headers: {},
            },
          )
          refreshData()
          console.log('Credit deducted successfully')
        } catch (error) {
          console.error('Error deducting credit:', error)
          showNotificationMessage('Error deducting credit', 'fail')
        }

        if (typeof onEventAdded === 'function') {
          onEventAdded()
        }
      } else {
        showNotificationMessage('Something went wrong', 'fail')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      showNotificationMessage('Something went wrong', 'fail')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22 }}>
            Your credits: {loggedUser?.credit}.
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
              }}>
              One credit will be deducted from your account when creating the
              event.
            </Text>
          </View>
        </View>

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
          <View style={{ backgroundColor: 'black', borderRadius: 10 }}>
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.datePicker}>
              <Text style={{ color: 'white' }}>Select Date & Time</Text>
            </TouchableOpacity>
            <View style={{}}>
              {showDatePicker && (
                <View style={[{ flexDirection: 'row' }]}>
                  <Text style={{ color: 'white', padding: 10, fontSize: 16 }}>
                    Select a Date:
                  </Text>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    accentColor="white"
                    themeVariant="dark"
                    textColor="white"
                    onChange={onDateChange}
                  />
                </View>
              )}
              {showTimePicker && (
                <View style={[{ flexDirection: 'row' }]}>
                  <Text style={{ color: 'white', padding: 10, fontSize: 16 }}>
                    Select a Time:
                  </Text>
                  <DateTimePicker
                    value={date}
                    mode="time"
                    accentColor="white"
                    themeVariant="dark"
                    textColor="white"
                    is24Hour={true}
                    onChange={onTimeChange}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        {formData.eventTime ? (
          <Text>
            Selected date and time:
            {formatDateAndTime(date)}
          </Text>
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
          style={{ width: 100, height: 100 }}
        />
        <TouchableOpacity
          style={[
            styles.touchable,
            !formComplete ? disabledButtonStyle : enabledButtonStyle,
            { width: 125, marginTop: 10 },
          ]}
          onPress={createEvent}
          disabled={
            loggedUser?.credit === null ||
            undefined ||
            loggedUser?.credit === 0 ||
            !formComplete
          }>
          <Text style={styles.text}>
            {loggedUser?.credit === null ||
            loggedUser?.credit === undefined ||
            loggedUser?.credit === 0
              ? 'Not enough credit'
              : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: 'black',
    borderWidth: 1,
    width: '100%',
    //  justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: 250,
    margin: 5,
    height: 35,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  datePicker: {
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: 'black',
    borderRadius: 10,
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
    textAlign: 'center',
  },
  title: {
    color: 'blue',
  },
})

export default EditForm

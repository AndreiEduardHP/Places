import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import {
  disabledButtonStyle,
  enabledButtonStyle,
} from '../Utils.tsx/ComponentColors.tsx/ButtonsColor'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import { ImageConfig } from '../config/imageConfig'
import { useNotification } from './Notification/NotificationProvider'
import { useUser } from '../Context/AuthContext'
import TermsAndConditions from './TermsAndConditions'
import { ScrollView } from 'react-native-gesture-handler'
import { formatDateAndTime } from '../Utils.tsx/Services/FormatDate'
import { useTranslation } from 'react-i18next'

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
    otherRelevantInformation: '',
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
  const { t } = useTranslation()

  const [formComplete, setFormComplete] = useState<boolean>(false)
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)

  useEffect(() => {
    const {
      eventName,
      eventDescription,
      maxParticipants,
      otherRelevantInformation,
    } = formData
    const isComplete =
      eventName.trim() !== '' &&
      eventDescription.trim() !== '' &&
      maxParticipants.trim() !== '' &&
      termsAccepted
    setFormComplete(isComplete)
  }, [formData, termsAccepted])

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
      keyboardVerticalOffset={64}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 22 }}>
              {t('eventForm.yourCredits')}: {loggedUser?.credit}.
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
                {t('eventForm.minusCredit')}
              </Text>
            </View>
          </View>

          <TextInput
            placeholder={t('eventForm.eventName')}
            value={formData.eventName}
            onChangeText={(text) => handleChange('eventName', text)}
            style={styles.input}
          />
          <TextInput
            placeholder={t('eventForm.eventDescription')}
            value={formData.eventDescription}
            onChangeText={(text) => handleChange('eventDescription', text)}
            style={styles.input}
          />
          <TextInput
            placeholder={t('eventForm.otherRelevantInformation')}
            value={formData.otherRelevantInformation}
            onChangeText={(text) =>
              handleChange('otherRelevantInformation', text)
            }
            style={styles.input}
          />

          <TextInput
            placeholder={t('eventForm.eventMaxParticipants')}
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
                <Text style={{ color: 'white' }}>
                  {' '}
                  {t('eventForm.selectDateAndTime')}
                </Text>
              </TouchableOpacity>
              <View style={{}}>
                {showDatePicker && (
                  <View style={[{ flexDirection: 'row' }]}>
                    <Text style={{ color: 'white', padding: 10, fontSize: 16 }}>
                      {t('eventForm.selectDate')}
                    </Text>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      is24Hour={true}
                      accentColor="white"
                      themeVariant="dark"
                      textColor="white"
                      minimumDate={new Date()}
                      onChange={onDateChange}
                    />
                  </View>
                )}
                {showTimePicker && (
                  <View style={[{ flexDirection: 'row' }]}>
                    <Text style={{ color: 'white', padding: 10, fontSize: 16 }}>
                      {t('eventForm.selectTime')}
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
              {t('eventForm.selectedDate')}
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
              <Text>{t('buttons.upload')}</Text>
            </View>
          </TouchableOpacity>
          {eventImg && (
            <Image
              source={{ uri: ImageConfig.IMAGE_CONFIG + eventImg }}
              style={{ width: 100, height: 100 }}
            />
          )}
          <View style={{ marginVertical: 10 }}></View>
          <TermsAndConditions
            accepted={termsAccepted}
            onToggle={() => {
              setTermsAccepted(!termsAccepted)
            }}></TermsAndConditions>
          <TouchableOpacity
            style={[
              styles.touchable,
              !formComplete ? disabledButtonStyle : enabledButtonStyle,
              { width: 125 },
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
                ? t('eventForm.notEnoughCredit')
                : t('buttons.save')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    height: 700,
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

import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native'
import { config } from '../config/urlConfig'
import axios from 'axios'
import {
  disabledButtonStyle,
  enabledButtonStyle,
} from '../Utils.tsx/ComponentColors.tsx/ButtonsColor'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import { useNotification } from './Notification/NotificationProvider'
import { useUser } from '../Context/AuthContext'
import TermsAndConditions from './TermsAndConditions'
import { ScrollView } from 'react-native-gesture-handler'
import { formatDateAndTime } from '../Utils.tsx/Services/FormatDate'
import { interests } from '../Utils.tsx/Interests/Interests'
import { CheckBox } from '@rneui/base'
import { PaperProvider, TextInput } from 'react-native-paper'
import { theme } from './SignUpFrom'
import { t } from 'i18next'
import { azureConfigBlob } from '../config/azureBlobConfig'
import { BlobServiceClient } from '@azure/storage-blob'

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
  const [checkFunctionality, setCheckFunctionality] = useState(false)
  const [formData, setFormData] = useState({
    otherRelevantInformation: '',
    eventName: '',
    eventDescription: '',
    eventImage: '',
    interest: '',
    checkFunctionality: checkFunctionality,
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
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)

  const [isPickerVisible, setPickerVisible] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectAllInterests, setSelectAllInterests] = useState(false)

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
      quality: 0.1,
      allowsEditing: true,
    })

    if (!result.canceled && result.assets) {
      const image = result.assets[0].uri
      try {
        const blobUrl = await uploadImageToBlob(image, formData.eventName)
        setEventImg(image)
        handleChange('eventImage', blobUrl)
        showNotificationMessage('Image uploaded successfully', 'success')
      } catch (error) {
        showNotificationMessage('Failed to upload image', 'fail')
      }
    } else {
      showNotificationMessage(
        'Image picking was cancelled or failed',
        'neutral',
      )
    }
  }
  const uploadImageToBlob = async (imageUri: string, eventName: string) => {
    try {
      const blobServiceClient = new BlobServiceClient(
        `https://${azureConfigBlob.accountName}.blob.core.windows.net?${azureConfigBlob.sasToken}`,
      )

      const containerClient = blobServiceClient.getContainerClient(
        azureConfigBlob.containerName,
      )

      const blobName = `${eventName}-${Date.now()}.jpg`

      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const response = await fetch(imageUri)
      const blob = await response.blob()

      blockBlobClient.uploadData(blob)

      return blockBlobClient.url
    } catch (error) {
      console.error('Error uploading image to Blob Storage:', error)
    }
  }

  const createEvent = async () => {
    formData.eventTime = date
    formData.checkFunctionality = checkFunctionality
    formData.interest = selectedInterests.join(',')

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

        try {
          await axios.post(
            `${config.BASE_URL}/api/UserProfile/DeductCredit/${loggedUser?.id}`,
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

  const handleSelectInterest = (interest: any) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest),
      )
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }
  const handleSelectAllInterests = () => {
    if (selectAllInterests) {
      setSelectedInterests([])
    } else {
      setSelectedInterests(interests)
    }
    setSelectAllInterests(!selectAllInterests)
  }
  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={undefined}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={[styles.container, {}]}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>
                {t('eventForm.yourCredits')}: {loggedUser?.credit}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                  }}>
                  {t('eventForm.minusCredit')}
                </Text>
              </View>
            </View>

            <TextInput
              mode="outlined"
              label={t('updateUser.lastName')}
              placeholderTextColor={theme.colors.text}
              textColor={theme.colors.text}
              cursorColor={theme.colors.text}
              outlineColor={theme.colors.text}
              selectionColor={theme.colors.text}
              placeholder={t('eventForm.eventName')}
              value={formData.eventName}
              onChangeText={(text) => handleChange('eventName', text)}
              style={styles.input}
              contentStyle={{ backgroundColor: 'transparent' }}
            />
            <TextInput
              mode="outlined"
              label={t('eventForm.eventDescription')}
              placeholder={t('eventForm.eventDescription')}
              value={formData.eventDescription}
              onChangeText={(text) => handleChange('eventDescription', text)}
              style={styles.input}
              multiline={true}
              numberOfLines={Platform.OS === 'ios' ? 4 : 3}
            />
            <TextInput
              mode="outlined"
              label={t('eventForm.otherRelevantInformation')}
              placeholder={t('eventForm.otherRelevantInformation')}
              value={formData.otherRelevantInformation}
              multiline={true}
              numberOfLines={Platform.OS === 'ios' ? 4 : 3}
              onChangeText={(text) =>
                handleChange('otherRelevantInformation', text)
              }
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label={t('eventForm.eventMaxParticipants')}
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
                marginTop: 5,
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
                      <Text
                        style={{ color: 'white', padding: 10, fontSize: 16 }}>
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
                </View>
                <View>
                  {showTimePicker && (
                    <View style={[{ flexDirection: 'row' }]}>
                      <Text
                        style={{ color: 'white', padding: 10, fontSize: 16 }}>
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

            <Modal
              animationType="slide"
              transparent={true}
              visible={isPickerVisible}
              onRequestClose={() => setPickerVisible(false)}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={{ fontSize: 24 }}>
                    {t('signUpScreen.selectMinimumOneInterest')}
                  </Text>

                  <View
                    style={[
                      styles.checkboxContainer,
                      {
                        borderBottomWidth: 1,
                        borderBottomColor: 'black',
                        width: '100%',

                        justifyContent: 'center',
                      },
                    ]}>
                    <CheckBox
                      containerStyle={{
                        marginVertical: 10,
                        padding: 0,
                        marginLeft: 0,
                        marginRight: 0,
                      }}
                      checked={selectAllInterests}
                      onPress={handleSelectAllInterests}
                      title={t('eventForm.selectAllInterests')}
                    />
                  </View>

                  <ScrollView>
                    {interests.map((interest, index) => (
                      <View key={index} style={styles.checkboxContainer}>
                        <CheckBox
                          containerStyle={{
                            marginTop: 10,
                            padding: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            marginBottom: 0,
                          }}
                          checked={selectedInterests.includes(interest)}
                          onPress={() => handleSelectInterest(interest)}
                          title={interest}
                        />
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'black',
                      borderRadius: 10,
                      width: 221,
                      marginVertical: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => setPickerVisible(false)}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 22,
                        padding: 5,
                      }}>
                      {t('buttons.save')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableWithoutFeedback onPress={() => setPickerVisible(true)}>
              <View>
                <Text
                  numberOfLines={2}
                  style={{ color: 'black', fontSize: 18 }}>
                  {t('eventForm.selectedInterest')}
                  <Text style={{ fontWeight: 300, fontSize: 18 }}>
                    {' '}
                    {selectedInterests || 'Select Interest'}
                  </Text>
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ alignItems: 'center' }}>
              {selectedInterests.length > 0 ? (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    marginTop: 2,
                    paddingHorizontal: 0,
                    color: 'black',
                  }}>
                  {t('signUpScreen.noteSelections')}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => {
                selectImage()
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
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
                source={{ uri: eventImg }}
                style={{ width: 100, height: 100, margin: 5 }}
              />
            )}

            <View style={{ marginVertical: 0 }}></View>
            <CheckBox
              style={{ margin: 0, padding: 0 }}
              containerStyle={{
                marginTop: 10,
                padding: 0,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 0,
              }}
              center
              textStyle={{ fontWeight: 500, margin: 0, padding: 0 }}
              title={t('labels.checkFunctionality')}
              checked={checkFunctionality}
              onPress={() => setCheckFunctionality(!checkFunctionality)}
            />
            <TermsAndConditions
              accepted={termsAccepted}
              onToggle={() => {
                setTermsAccepted(!termsAccepted)
              }}></TermsAndConditions>
            <TouchableOpacity
              style={[
                styles.touchable,
                !formComplete ? disabledButtonStyle : enabledButtonStyle,
                { width: '100%' },
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 1,
    paddingHorizontal: 5,
    flex: 1,
  },
  inputInterest: {
    justifyContent: 'center',
    width: 375,
    height: 220,
    // margin: 4,
    //  borderRadius: 30,
    borderColor: 'black',
    // borderWidth: 1,
    // paddingHorizontal: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  label: {},
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: 700,
    // elevation: 5,
  },
  picker: {
    width: 300,
    height: 200,
  },

  input: {
    width: '100%',
    marginTop: 4,
    backgroundColor: 'white',
    // height: 35,
    //  borderRadius: 10,
    //  borderColor: 'gray',
    //  borderWidth: 1,
    // paddingHorizontal: 10,
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
    paddingVertical: 10,
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

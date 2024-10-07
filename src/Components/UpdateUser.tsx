import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import axios from 'axios'
import { useUser } from '../Context/AuthContext'
import { config } from '../config/urlConfig'
import { useNotification } from './Notification/NotificationProvider'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { Button } from '@rneui/base'
import { Text } from '@rneui/themed'
import { CheckBox } from '@rneui/base'
import { DefaultTheme, PaperProvider, TextInput } from 'react-native-paper'
import { validateEmail } from '../Utils.tsx/EmailValidation'
import { interests } from '../Utils.tsx/Enums/Interests'
import { t } from 'i18next'

interface UserProfileDto {
  Id?: number
  FirstName?: string
  LastName?: string
  Username?: string
  PhoneNumber?: string

  Email?: string
  City?: string
  Interest?: string
  ProfilePicture?: string
  CurrentLocationId?: number
  FriendRequestStatus?: string
  AreFriends?: boolean
  Description: string
  CurrentLongitude: number
  CurrentLatitude: number
}

const UserProfileForm: React.FC = () => {
  const { loggedUser, refreshData } = useUser()
  const [userProfile, setUserProfile] = useState<Partial<UserProfileDto>>({})
  const { showNotificationMessage } = useNotification()
  const { textColor, backgroundColor } = useThemeColor()

  const [isPickerVisible, setPickerVisible] = useState(false)
  const [showNewInterest, setShowNewInterest] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const checkForm = !!(
    userProfile.FirstName &&
    userProfile.LastName &&
    userProfile.PhoneNumber &&
    userProfile.Description &&
    selectedInterests.length >= 1 &&
    userProfile.Description != '-' &&
    userProfile.Description?.length > 50
  )

  const theme = {
    ...DefaultTheme,
    roundness: 12,
    colors: {
      ...DefaultTheme.colors,
      primary: textColor,
      placeholder: 'white',
      primaryContainer: textColor,
      secondary: textColor,
      background: backgroundColor,
      onSurfaceVariant: textColor,
      card: textColor,
      text: textColor,

      notification: textColor,
    },
  }
  useEffect(() => {
    if (loggedUser) {
      updateField('FirstName', loggedUser?.firstName)
      updateField('LastName', loggedUser?.lastName)
      updateField('Username', loggedUser?.username)
      updateField('PhoneNumber', loggedUser?.phoneNumber)
      updateField('Email', loggedUser?.email)
      updateField('City', loggedUser?.city)
      updateField('Description', loggedUser?.description)
      if (loggedUser?.interest) {
        setSelectedInterests(loggedUser.interest.split(', '))
      }
    }
  }, [])

  const handleUpdate = async () => {
    if (loggedUser?.id) {
      try {
        const updatePayload = { ...userProfile, Id: loggedUser.id }
        updatePayload.CurrentLatitude = loggedUser.currentLatitude
        updatePayload.CurrentLongitude = loggedUser.currentLongitude
        updatePayload.Username = updatePayload.FirstName
          ? updatePayload.FirstName +
            (updatePayload.LastName ? updatePayload.LastName?.charAt(0) : '')
          : 'UserName'
        updatePayload.Interest = selectedInterests.join(', ')

        const url = `${config.BASE_URL}/api/userprofile/${loggedUser.id}`
        await axios.put(url, updatePayload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        await refreshData()
        showNotificationMessage('User profile updated successfully', 'success')

        if (
          updatePayload.Email &&
          updatePayload.Email !== loggedUser.email &&
          updatePayload.Email !== '-' &&
          updatePayload.Email !== ''
        ) {
          try {
            await axios.post(
              `${config.BASE_URL}/api/userprofile/send/email/${loggedUser.id}`,
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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            showNotificationMessage('Email already exists', 'fail')
          } else {
            showNotificationMessage('Failed to update user profile', 'fail')
          }
        } else {
          showNotificationMessage('An unexpected error occurred', 'fail')
        }
      }
    } else {
      showNotificationMessage('User ID is undefined', 'fail')
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

  const updateField = (
    field: keyof UserProfileDto,
    value: string | number | boolean,
  ) => {
    setUserProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }))
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 7,
    },
    input: {
      marginBottom: 6,
      color: 'red',
    },
    button: {
      marginTop: 20,
      marginBottom: 10,
    },
    buttonContent: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: textColor == 'white' ? 'black' : 'white',
      fontSize: 19,
    },
    label: {
      color: textColor,

      fontSize: 18,
      fontWeight: '300',
    },
    borderContainer: {
      marginBottom: 8,
      marginTop: 2,
      borderRadius: 20,
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
    checkbox: {
      marginRight: 8,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
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
  })

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.label, { fontSize: 28 }]}>
            {t('updateUser.yourInformation')}
          </Text>
        </View>
        <TextInput
          mode="outlined"
          label={t('updateUser.firstName') + ' *'}
          placeholder={t('updateUser.firstName') + ' *'}
          value={userProfile.FirstName}
          onChangeText={(text) => updateField('FirstName', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={userProfile.FirstName != '' ? textColor : 'red'}
        />

        <TextInput
          mode="outlined"
          label={t('updateUser.lastName') + ' *'}
          placeholder={t('updateUser.lastName') + ' *'}
          value={userProfile.LastName}
          onChangeText={(text) => updateField('LastName', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={userProfile.LastName != '' ? textColor : 'red'}
          selectionColor={textColor}
        />

        <TextInput
          mode="outlined"
          label={t('updateUser.phoneNumber') + ' *'}
          placeholder={t('updateUser.phoneNumber') + ' *'}
          value={userProfile.PhoneNumber}
          onChangeText={(text) => updateField('PhoneNumber', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          selectionColor={textColor}
          outlineColor={userProfile.PhoneNumber != '' ? textColor : 'red'}
          keyboardType="numeric"
        />
        <TextInput
          mode="outlined"
          label={t('updateUser.email')}
          placeholder={t('updateUser.email')}
          value={userProfile.Email}
          onChangeText={(text) => updateField('Email', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={
            userProfile.Email == '-' || validateEmail(userProfile.Email ?? '')
              ? textColor
              : 'red'
          }
          selectionColor={textColor}
        />
        <TextInput
          mode="outlined"
          label={t('updateUser.city')}
          placeholder={t('updateUser.city')}
          value={userProfile.City}
          onChangeText={(text) => updateField('City', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={textColor}
          selectionColor={textColor}
        />
        <TextInput
          mode="outlined"
          label={'Description' + ' *' + ' (min 50 char)'}
          placeholder={'Description' + ' *'}
          value={userProfile.Description}
          onChangeText={(text) => updateField('Description', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={
            !userProfile.Description ||
            userProfile.Description === '-' ||
            userProfile.Description.length < 50
              ? 'red'
              : textColor
          }
          selectionColor={textColor}
          multiline={true}
          numberOfLines={Platform.OS === 'ios' ? 4 : 3}
        />
        <TouchableWithoutFeedback
          style={styles.inputInterest}
          onPress={() => {
            setPickerVisible(true)
            setShowNewInterest(true)
          }}>
          <View>
            <Text
              numberOfLines={2}
              style={{ color: '#266EC3', paddingHorizontal: 7 }}>
              {t('eventForm.selectedInterest')}:{' '}
              <Text style={{ color: '#266EC3' }}>{loggedUser?.interest}</Text>
            </Text>
            {showNewInterest && (
              <Text
                style={{
                  color: textColor,
                  paddingHorizontal: 7,
                  paddingTop: 10,
                }}>
                New Interests: {selectedInterests.join(', ')}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
        <View style={{}}>
          {selectedInterests.length > 0 || loggedUser?.interest !== ' ' ? (
            <Text
              style={{
                fontSize: 14,
                fontWeight: '300',
                marginTop: 5,
                paddingHorizontal: 7,
                color: textColor,
              }}>
              {t('signUpScreen.noteSelections')}
            </Text>
          ) : null}
        </View>
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
                      // value={selectedInterests.includes(interest)}
                      onPress={() => handleSelectInterest(interest)}
                      style={styles.checkbox}
                      title={interest}
                      checked={selectedInterests.includes(interest)}
                      containerStyle={{ margin: 0, padding: 0, marginTop: 10 }}
                    />
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  borderRadius: 10,
                  width: 180,
                  marginTop: 10,
                  alignItems: 'center',
                }}
                onPress={() => setPickerVisible(false)}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    padding: 5,
                    //  width: 200,
                  }}>
                  {t('buttons.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Button
          buttonStyle={{
            backgroundColor: textColor,
            borderRadius: 9,
            marginBottom: 25,
            opacity: !checkForm == true ? 0.51 : 1,
          }}
          onPress={handleUpdate}
          containerStyle={styles.button}
          disabled={!checkForm}>
          <Text style={styles.buttonText}>{t('updateUser.updateProfile')}</Text>
        </Button>
      </View>
    </PaperProvider>
  )
}

export default UserProfileForm

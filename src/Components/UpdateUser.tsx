import React, { useEffect, useState } from 'react'
import {
  TextInput,
  Button,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import axios from 'axios'
import { Profile, useUser } from '../Context/AuthContext'
import { config } from '../config/urlConfig'
import { useNotification } from './Notification/NotificationProvider'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useTranslation } from 'react-i18next'
import { LinearGradient } from 'expo-linear-gradient'

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
}

const UserProfileForm: React.FC = () => {
  const { loggedUser, refreshData } = useUser()
  const [userProfile, setUserProfile] = useState<Partial<UserProfileDto>>({})
  const { showNotificationMessage } = useNotification()
  const { textColor } = useThemeColor()
  const { t } = useTranslation()

  useEffect(() => {
    if (loggedUser) {
      updateField('FirstName', loggedUser?.firstName)
      updateField('LastName', loggedUser?.lastName)
      updateField('Username', loggedUser?.username)
      updateField('PhoneNumber', loggedUser?.phoneNumber)
      updateField('Email', loggedUser?.email)
      updateField('City', loggedUser?.city)
    }
  }, [])

  const handleUpdate = async () => {
    if (loggedUser?.id) {
      try {
        const updatePayload = { ...userProfile, Id: loggedUser.id }
        const url = `${config.BASE_URL}/api/userprofile/${loggedUser.id}`
        await axios.put(url, updatePayload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        await refreshData()
        showNotificationMessage('User profile updated successfully', 'success')
      } catch (error) {
        showNotificationMessage('Failed to update user profile', 'fail')
      }
    } else {
      showNotificationMessage('User ID is undefined', 'fail')
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
      //height: 70,
      //borderColor: 'gray',
      // borderWidth: 1,
      // marginBottom: 8,
      marginTop: 2,
      borderRadius: 30,
      //  paddingHorizontal: 5,
      color: textColor,
    },
    button: {
      marginTop: 'auto',
      marginBottom: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center', // Center text horizontally
      justifyContent: 'center', // Center text vertically
      borderColor: 'rgba(210,220,190,0.51)',
      borderWidth: 1,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonContent: {
      width: '100%',
      alignItems: 'center', // Center text horizontally
      justifyContent: 'center', // Center text vertically
    },
    buttonText: {
      color: 'white',
      fontSize: 24,
    },
    label: {
      color: 'white',
      //marginBottom: 2,
      marginTop: 2,
      fontSize: 18,
      fontWeight: '500',
    },
    borderContainer: {
      height: 47,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 8,
      marginTop: 2,
      borderRadius: 20,
      paddingHorizontal: 15,
    },
  })

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.label, { fontSize: 34 }]}>Your information</Text>
      </View>
      <View style={styles.borderContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder={t('updateUser.firstName')}
          placeholderTextColor={textColor}
          value={userProfile.FirstName}
          onChangeText={(text) => updateField('FirstName', text)}
        />
      </View>

      <View style={styles.borderContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder={t('updateUser.lastName')}
          placeholderTextColor={textColor}
          value={userProfile.LastName}
          onChangeText={(text) => updateField('LastName', text)}
        />
      </View>

      <View style={styles.borderContainer}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder={t('updateUser.userName')}
          placeholderTextColor={textColor}
          value={userProfile.Username}
          onChangeText={(text) => updateField('Username', text)}
        />
      </View>

      <View style={styles.borderContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder={t('updateUser.phoneNumber')}
          placeholderTextColor={textColor}
          value={userProfile.PhoneNumber}
          onChangeText={(text) => updateField('PhoneNumber', text)}
        />
      </View>

      <View style={styles.borderContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder={t('updateUser.email')}
          placeholderTextColor={textColor}
          value={userProfile.Email}
          onChangeText={(text) => updateField('Email', text)}
        />
      </View>

      <View style={styles.borderContainer}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder={t('updateUser.city')}
          placeholderTextColor={textColor}
          value={userProfile.City}
          onChangeText={(text) => updateField('City', text)}
        />
      </View>

      <View style={styles.borderContainer}>
        <Text style={styles.label}>Interest</Text>
        <TextInput
          style={styles.input}
          placeholder={t('updateUser.interest')}
          placeholderTextColor={textColor}
          value={userProfile.Interest}
          onChangeText={(text) => updateField('Interest', text)}
        />
      </View>

      <LinearGradient
        colors={['black', 'rgba(255,255,255,0.1)']} // Example gradient colors
        style={styles.button}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <TouchableOpacity style={styles.buttonContent} onPress={handleUpdate}>
          <Text style={styles.buttonText}>{t('updateUser.updateProfile')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default UserProfileForm

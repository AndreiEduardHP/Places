import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { Profile, useUser } from '../Context/AuthContext'
import { config } from '../config/urlConfig'
import { useNotification } from './Notification/NotificationProvider'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useTranslation } from 'react-i18next'
import { LinearGradient } from 'expo-linear-gradient'
import { Button } from '@rneui/base'
import { Text } from '@rneui/themed'
import { DefaultTheme, PaperProvider, TextInput } from 'react-native-paper'
import { DarkTheme } from '@react-navigation/native'

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
  const { textColor, backgroundColor } = useThemeColor()
  const { t } = useTranslation()
  const theme = {
    ...DefaultTheme,
    roundness: 16,
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
      marginBottom: 6,
      color: 'red',
    },
    button: {
      marginTop: 'auto',
      marginBottom: 10,
    },
    buttonContent: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: textColor == 'white' ? 'black' : 'white',
      fontSize: 24,
    },
    label: {
      color: textColor,

      fontSize: 18,
      fontWeight: '500',
    },
    borderContainer: {
      marginBottom: 8,
      marginTop: 2,
      borderRadius: 20,
    },
  })

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.label, { fontSize: 34 }]}>Your information</Text>
        </View>
        <TextInput
          mode="outlined"
          label={t('updateUser.firstName')}
          placeholder={t('updateUser.firstName')}
          value={userProfile.FirstName}
          onChangeText={(text) => updateField('FirstName', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={textColor}
        />
        <TextInput
          mode="outlined"
          label={t('updateUser.lastName')}
          placeholder={t('updateUser.lastName')}
          value={userProfile.LastName}
          onChangeText={(text) => updateField('LastName', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={textColor}
          selectionColor={textColor}
        />
        <TextInput
          mode="outlined"
          label={t('updateUser.userName')}
          placeholder={t('updateUser.userName')}
          value={userProfile.Username}
          onChangeText={(text) => updateField('Username', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={textColor}
          selectionColor={textColor}
        />
        <TextInput
          mode="outlined"
          label={t('updateUser.phoneNumber')}
          placeholder={t('updateUser.phoneNumber')}
          value={userProfile.PhoneNumber}
          onChangeText={(text) => updateField('PhoneNumber', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={textColor}
          selectionColor={textColor}
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
          outlineColor={textColor}
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
          label={t('updateUser.interest')}
          placeholder={t('updateUser.interest')}
          value={userProfile.Interest}
          onChangeText={(text) => updateField('Interest', text)}
          style={styles.input}
          placeholderTextColor={textColor}
          textColor={textColor}
          cursorColor={textColor}
          outlineColor={textColor}
          selectionColor={textColor}
        />
        <Button
          buttonStyle={{ backgroundColor: textColor, borderRadius: 10 }}
          onPress={handleUpdate}
          containerStyle={styles.button}>
          <Text style={styles.buttonText}>{t('updateUser.updateProfile')}</Text>
        </Button>
      </View>
    </PaperProvider>
  )
}

export default UserProfileForm

import React, { useState } from 'react'
import { TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native'
import axios from 'axios'
import { useUser } from '../Context/AuthContext'
import { config } from '../config/urlConfig'
import { useNotification } from './Notification/NotificationProvider'

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

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor={'white'}
        value={userProfile.FirstName}
        onChangeText={(text) => updateField('FirstName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor={'white'}
        value={userProfile.LastName}
        onChangeText={(text) => updateField('LastName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={'white'}
        value={userProfile.Username}
        onChangeText={(text) => updateField('Username', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor={'white'}
        value={userProfile.PhoneNumber}
        onChangeText={(text) => updateField('PhoneNumber', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'white'}
        value={userProfile.Email}
        onChangeText={(text) => updateField('Email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor={'white'}
        value={userProfile.City}
        onChangeText={(text) => updateField('City', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Interest"
        placeholderTextColor={'white'}
        value={userProfile.Interest}
        onChangeText={(text) => updateField('Interest', text)}
      />
      <Button title="Update Profile" onPress={handleUpdate} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
})

export default UserProfileForm

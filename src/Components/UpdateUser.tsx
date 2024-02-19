import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import axios from 'axios'
import { useUser } from '../Context/AuthContext'
import { config } from '../config/urlConfig'

interface UserProfileDto {
  Id?: number
  FirstName?: string
  LastName?: string
  Username?: string
  PhoneNumber?: string
  Email?: string
  City?: string
  Interest?: string
  ProfilePicture?: string // Assuming base64 encoded string for the byte[] from C#
  CurrentLocationId?: number
  FriendRequestStatus?: string
  AreFriends?: boolean
}

const UserProfileForm: React.FC = () => {
  const { loggedUser, refreshData } = useUser()
  const [userProfile, setUserProfile] = useState<Partial<UserProfileDto>>({})

  const handleUpdate = async () => {
    if (loggedUser?.id) {
      try {
        const updatePayload = { ...userProfile, Id: loggedUser.id } // Include the Id in the payload
        const url = `${config.BASE_URL}/api/userprofile/${loggedUser.id}`
        await axios.put(url, updatePayload, {
          headers: {
            'Content-Type': 'application/json',
            // Include other headers as required, such as Authorization headers for JWT
          },
        })
        await refreshData()
        Alert.alert('Success', 'User profile updated successfully')
      } catch (error) {
        console.error('Error updating user profile:', error)
        Alert.alert('Error', 'Failed to update user profile')
      }
    } else {
      Alert.alert('Error', 'User ID is undefined')
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
        value={userProfile.FirstName}
        onChangeText={(text) => updateField('FirstName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={userProfile.LastName}
        onChangeText={(text) => updateField('LastName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userProfile.Username}
        onChangeText={(text) => updateField('Username', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={userProfile.PhoneNumber}
        onChangeText={(text) => updateField('PhoneNumber', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userProfile.Email}
        onChangeText={(text) => updateField('Email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={userProfile.City}
        onChangeText={(text) => updateField('City', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Interest"
        value={userProfile.Interest}
        onChangeText={(text) => updateField('Interest', text)}
      />
      {/* Add other input fields as needed */}
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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
})

export default UserProfileForm

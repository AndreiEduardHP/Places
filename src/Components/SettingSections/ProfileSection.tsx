import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'

import { useUser } from '../../Context/AuthContext'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import UserProfilePicture from '../UserProfilePicture'
import { useNotification } from '../Notification/NotificationProvider'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { BlobServiceClient } from '@azure/storage-blob'
import { azureConfigBlob } from '../../config/azureBlobConfig'

interface ProfileSectionProps {
  showEditIcon: boolean
  showTouchIcon: boolean
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  showEditIcon,
  showTouchIcon,
}) => {
  const { loggedUser, refreshData } = useUser()
  const { textColor, backgroundColorGrey } = useThemeColor()
  const { showNotificationMessage } = useNotification()

  const [isModalVisible, setModalVisible] = useState(false)

  const styles = StyleSheet.create({
    editIcon: { paddingTop: 3, alignItems: 'center', color: textColor },
    editIconLogo: { alignItems: 'center' },
    container: {
      flexDirection: 'row',
      backgroundColor: backgroundColorGrey,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    text: {
      color: textColor,
    },
    content: {
      paddingHorizontal: 15,
      paddingVertical: 0,
    },
    textContent: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    enlargedImage: {
      width: 222,
      height: 222,
      resizeMode: 'contain',
    },
  })

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.1,
      aspect: [1, 1],

      allowsEditing: true,
      base64: true,
    })

    if (!result.canceled && result.assets) {
      const image = result.assets[0].uri

      await uploadImage(loggedUser?.id, image)
    } else {
      showNotificationMessage('Image picking was cancelled or failed', 'fail')
    }
  }

  const uploadImage = async (userProfileId: any, imageFile: any) => {
    try {
      const blobUrl = await uploadImageToBlob(imageFile, userProfileId)
      const formData = new FormData()
      formData.append('userProfileId', userProfileId)
      formData.append('imageFile', blobUrl as any)

      const response = await axios.post(
        `${config.BASE_URL}/api/UserProfile/UpdateUserImage/${userProfileId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (response.status === 204) {
        showNotificationMessage('Image upload succesfully', 'success')
        refreshData()
      } else {
        showNotificationMessage('Image upload failed', 'fail')
      }
    } catch (error: any) {
      if (error.response) {
        console.error(
          'Server error:',
          error.response.status,
          error.response.data,
        )
        showNotificationMessage(
          `Server error: ${error.response.status} - ${error.response.data}`,
          'fail',
        )
      } else if (error.request) {
        console.error('Network error, no response received:', error.request)
        showNotificationMessage(
          'Network error: No response received from server',
          'fail',
        )
      } else {
        console.error('Error setting up the request:', error.message)
        showNotificationMessage(`Error: ${error.message}`, 'fail')
      }
    }
  }

  const uploadImageToBlob = async (imageUri: string, userProfileId: string) => {
    try {
      const blobServiceClient = new BlobServiceClient(
        `https://${azureConfigBlob.accountName}.blob.core.windows.net?${azureConfigBlob.sasToken}`,
      )

      const containerClient = blobServiceClient.getContainerClient(
        azureConfigBlob.containerName,
      )

      const blobName = `${userProfileId}-${Date.now()}.jpg`

      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const response = await fetch(imageUri)
      const blob = await response.blob()

      blockBlobClient.uploadData(blob)

      return blockBlobClient.url
    } catch (error) {
      console.error('Error uploading image to Blob Storage:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <UserProfilePicture width={60} height={60} resizeMode={false} />
        </TouchableOpacity>
        {showEditIcon && (
          <TouchableOpacity
            onPress={() => {
              selectImage()
            }}
            style={styles.editIconLogo}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 5,
                  marginVertical: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: textColor,
                }}
                source={require('../../../assets/Icons/edit.png')}
              />
              <Text style={styles.editIcon}>Edit</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.textContent}>
        <Text style={[styles.text, { fontSize: 20 }]}>
          {loggedUser?.firstName} {loggedUser?.lastName}
        </Text>

        <Text style={[styles.text, {}]}>{loggedUser?.firstName}</Text>
      </View>
      {showTouchIcon && (
        <View
          style={{
            marginLeft: 'auto',
            justifyContent: 'center',
            paddingRight: 10,
          }}>
          <MaterialIcons name="arrow-forward-ios" size={22} color={textColor} />
        </View>
      )}
      <Modal visible={isModalVisible} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <UserProfilePicture width={400} height={400} resizeMode={true} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default ProfileSection

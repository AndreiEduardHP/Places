import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from 'react-native'

import { useUser } from '../../Context/AuthContext'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import UserProfilePicture from '../UserProfilePicture'
import { useNotification } from '../Notification/NotificationProvider'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import { useNavigation } from '@react-navigation/native'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'

interface ProfileSectionProps {
  showEditIcon: boolean
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ showEditIcon }) => {
  const { t } = useTranslation()
  const { loggedUser, refreshData } = useUser()
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()

  const styles = StyleSheet.create({
    editIcon: { paddingTop: 5, alignItems: 'center', color: textColor },
    editIconLogo: { alignItems: 'center' },
    container: {
      flexDirection: 'row',
      backgroundColor: backgroundColorGrey,
      borderRadius: 10,
      marginHorizontal: 10,
      marginTop: 5,
    },
    text: {
      color: textColor,
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    textContent: {
      justifyContent: 'center',
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
      quality: 1,
    })

    if (!result.canceled && result.assets) {
      const image = result.assets[0]
      uploadImage(loggedUser?.id, image)
    } else {
      showNotificationMessage('Image picking was cancelled or failed', 'fail')
    }
  }
  const uploadImage = async (userProfileId: any, imageFile: any) => {
    try {
      const formData = new FormData()
      formData.append('userProfileId', userProfileId)
      const file = {
        uri: imageFile.uri,
        name: imageFile.fileName,
        type: imageFile.type,
      }

      formData.append('imageFile', file as any)

      const response = await axios.post(
        `${config.BASE_URL}/api/UserProfile/UpdateUserImage/${userProfileId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (response.status === 200) {
        showNotificationMessage('Image upload succesfully', 'success')
        refreshData()
      } else {
        showNotificationMessage('Image upload failed', 'fail')
      }
    } catch (error) {
      console.error('Network error:', error)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <UserProfilePicture width={60} height={60} />
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
                  marginTop: 4,
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
    </View>
  )
}

export default ProfileSection

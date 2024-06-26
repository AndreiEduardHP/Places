// UserProfilePicture.js
import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { useUser } from '../Context/AuthContext'

interface Props {
  width: number
  height: number
}

const UserProfilePicture: React.FC<Props> = ({ width, height }) => {
  const { loggedUser } = useUser()
  const imageUri = `data:image/jpeg;base64,${loggedUser?.profilePicture}`

  const styles = StyleSheet.create({
    profilePic: {
      width: width,
      height: height,
      marginVertical: 5,
      borderRadius: 100,
    },
  })

  return (
    <Image
      source={
        loggedUser?.profilePicture
          ? { uri: imageUri }
          : require('../../assets/DefaultUserIcon.png')
      }
      style={styles.profilePic}
    />
  )
}

export default UserProfilePicture

import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useUser } from '../Context/AuthContext'
import { Skeleton } from '@rneui/base'

interface Props {
  width: number
  height: number
  resizeMode: boolean
}

const UserProfilePicture: React.FC<Props> = ({ width, height, resizeMode }) => {
  const { loggedUser } = useUser()
  const [loading, setLoading] = useState(true)

  const styles = StyleSheet.create({
    profilePicContainer: {
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profilePic: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
    },
    activityIndicator: {
      position: 'absolute',
      zIndex: 1,
    },
  })

  return (
    <View style={styles.profilePicContainer}>
      {loading && (
        <Skeleton
          animation="wave"
          style={[styles.profilePic, styles.activityIndicator]}
        />
      )}
      <Image
        source={
          loggedUser?.profilePicture
            ? { uri: loggedUser?.profilePicture }
            : require('../../assets/DefaultUserIcon.png')
        }
        style={styles.profilePic}
        resizeMode={resizeMode ? 'contain' : 'cover'}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  )
}

export default UserProfilePicture

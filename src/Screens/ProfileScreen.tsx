import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ImageBackground,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import LogInForm from '../Components/LogInForm'
import Greeting from '../Components/Greeting'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import * as ImagePicker from 'expo-image-picker'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'

const ProfileScreen: React.FC = () => {
  const {
    loggedUser,
    handleLogout,
    updateProfileImage,
    refreshData,
    friendRequestsCount,
    fetchFriendRequests,
    fetchFriendCount,
  } = useUser()
  const { t } = useTranslation()
  const handleNavigation = useHandleNavigation()
  const [connectionsCount, setConnectionsCount] = useState<number>(0)

  const id = loggedUser?.id || 0

  const imageUri = `data:image/jpeg;base64,${loggedUser?.profilePicture}`
  // 'imageUrl' will be the image URL if 'loggedUser' is not null,
  // or 'default-image-url.jpg' if 'loggedUser' is null

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
      // Use the first selected image
      const image = result.assets[0]
      uploadImage(2, image) // Replace '2' with the actual userProfileId
    } else {
      console.log('Image picking was cancelled or failed')
    }
  }
  const uploadImage = async (userProfileId: any, imageFile: any) => {
    try {
      const formData = new FormData()
      formData.append('userProfileId', userProfileId)
      const file = {
        uri: imageFile.uri,
        name: imageFile.fileName, // use the actual file name from the image result
        type: imageFile.type, // use the actual mime type from the image result
      }

      // Append the file to formData
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
        // Image uploaded successfully
        console.log('Image uploaded successfully')
        refreshData()
      } else {
        // Handle error
        console.error('Image upload failed')
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Network error:', error)
    }
  }

  useEffect(() => {
    fetchFriendRequests()
  }, [])
  useEffect(() => {
    if (loggedUser?.id) {
      fetchFriendCount(loggedUser.id)
        .then((count) => {
          setConnectionsCount(count)
        })
        .catch((error) => {
          console.error('Error fetching friend count:', error)
          // Handle the error appropriately
        })
    }
  }, [loggedUser, fetchFriendCount])

  return (
    <>
      <ScrollView style={styles.container}>
        <ImageBackground
          source={require('../../assets/menu-bg.jpg')} // replace with your image path
          resizeMode="cover"
          imageStyle={{ opacity: 0.95 }}>
          <View style={styles.header}>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingLeft: 50,
              }}>
              <Image
                source={{
                  uri:
                    loggedUser?.profilePicture !== ''
                      ? imageUri
                      : 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png',
                }}
                style={styles.profilePic}
              />
              <TouchableOpacity
                onPress={() => {
                  selectImage()
                }}
                style={styles.editIconLogo}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      tintColor: 'white',
                    }}
                    source={require('../../assets/Icons/edit.png')}
                  />
                  <Text style={styles.editIcon}>Edit</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Greeting style={styles.name} />
              <Text style={styles.name}>
                {loggedUser?.firstName} {loggedUser?.lastName}
              </Text>
            </View>
            <View></View>
            <Text style={[styles.title, { marginTop: 5, fontSize: 18 }]}>
              Interests: {loggedUser?.interest}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  marginTop: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/phone-call.png')}
              />
              <Text style={styles.phone}> {loggedUser?.phoneNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  marginTop: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/email.png')}
              />
              <Text style={styles.email}> {loggedUser?.email}</Text>
            </View>
          </View>

          <View style={styles.walletContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.walletText}>Ballance: </Text>
              <Text style={styles.walletTextsum}>$140.000.000</Text>
            </View>

            <TouchableOpacity onPress={() => handleNavigation('Chat')}>
              <Text style={styles.ordersText}>
                Connections: {connectionsCount}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('FriendRequestScreen')}>
            <Text style={styles.buttonText}>
              {' '}
              Friend Requests: {friendRequestsCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Tell Your Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Promotions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleLogout()
              handleNavigation('DefaultScreen')
            }}
            style={styles.logoutButton}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/logout.png')}
              />
              <Text style={styles.logoutButtonText}>Log out</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleLogout()
              handleNavigation('DefaultScreen')
            }}
            style={styles.deleteAccountButton}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  tintColor: 'white',
                }}
                source={require('../../assets/Icons/delete.png')}
              />
              <Text style={styles.deleteAccountButtonText}>Delete account</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', margin: 10 }}>
                powered by google
              </Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
      <View>
        <FooterNavbar currentRoute={'ProfileScreen'} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    height: 120,
    position: 'absolute',
    zIndex: 10,
    top: 100,
  },
  header: {
    alignItems: 'center',

    padding: 10,
  },

  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 100,
    ...Platform.select({
      ios: {
        shadowColor: 'white',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    letterSpacing: -0.7,
    color: 'white',
  },
  title: {
    color: 'white',
  },
  phone: {
    color: 'white',
    marginTop: 5,
    fontSize: 18,
  },
  email: {
    color: 'white',
    marginTop: 5,
    fontSize: 18,
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 3, // Adjust the border width as needed
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 8,
  },
  walletText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  walletTextsum: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(140, 255, 0, 0.9)',
  },
  ordersText: {
    fontSize: 18,
    color: 'white',
  },
  button: {
    padding: 20,
    borderBottomWidth: 1, // Adjust the border width as needed
    borderBottomColor: 'rgba(11, 11, 11, 0.41)',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,

    color: 'white',
  },
  logoutButton: {
    padding: 20,
    borderTopWidth: 2, // Adjust the border width as needed
    borderTopColor: 'rgba(255,255, 255, 0.35)',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      },
      android: {
        elevation: 1, // Adjust the elevation value as needed
      },
    }),
  },
  logoutButtonText: {
    fontSize: 16,
    color: 'rgba(255,111,111,1)',
    paddingTop: 3,
    fontWeight: '400',
  },
  deleteAccountButton: {
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      },
      android: {
        elevation: 1, // Adjust the elevation value as needed
      },
    }),
  },
  deleteAccountButtonText: {
    fontSize: 16,
    color: 'rgba(255,111,111,1)',
    paddingTop: 3,
    fontWeight: '400',
  },
  editIcon: { paddingTop: 5, alignItems: 'center', color: 'white' },
  editIconLogo: { paddingTop: 70, alignItems: 'center' },
})

export default ProfileScreen

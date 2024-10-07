import { t } from 'i18next'
import React, { useCallback, useEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  ImageBackground,
  Modal,
} from 'react-native'
import FooterNavbar from '../Components/FooterNavbar'
import { ImageConfig } from '../config/imageConfig'
import { RouteProp, useRoute } from '@react-navigation/native'
import { ChatRoomProps, RootStackParamList } from '../Navigation/Types'
import { useNotification } from '../Components/Notification/NotificationProvider'
import ProfileDetails from '../Components/SettingSections/ProfileDetails'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import LineComponent from '../Components/LineComponent'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button, Skeleton } from '@rneui/base'
import BackAction from '../Components/Back'
import { getLocation } from '../Services/CurrentLocation'

const SelectedPersonInfo: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>()
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  // const personData = route.params?.personData
  const [personData, setPersonData] = useState(route.params?.personData)
  const { loggedUser } = useUser()
  const [modalVisible, setModalVisible] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const handleNavigation = useHandleNavigation()
  const [loading, setLoading] = useState(true)
  const userProfileData: {
    icon: string
    label: string
    value: string | number | undefined
  }[] = [
    {
      icon: 'location-city',
      label: t('signUpScreen.city'),
      value: personData?.city,
    },
    { icon: 'alternate-email', label: 'Email', value: personData?.email },
    { icon: 'interests', label: 'Interest', value: personData?.interest },
    {
      icon: 'description',
      label: 'Description',
      value: personData?.description,
    },
    {
      icon: 'phone-callback',
      label: t('signUpScreen.phoneNumber'),
      value: personData?.phoneNumber,
    },
    {
      icon: 'badge',
      label: 'Username',
      value: personData?.firstName + ' ' + personData?.lastName.charAt(0),
    },
  ]

  useEffect(() => {
    fetchLocation()
  }, [personData, getLocation])

  const handleEmail = () => {
    const recipientEmail = personData?.email
    const subject = 'Subject of your email'
    const body = 'Body of your email'

    const mailToUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`

    Linking.openURL(mailToUrl)
  }
  const handleCall = () => {
    const phoneNumber = personData?.phoneNumber
    const phoneUrl = `tel:${phoneNumber}`

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          showNotificationMessage('Phone number is not available', 'fail')
        } else {
          return Linking.openURL(phoneUrl)
        }
      })
      .catch((err) => console.error('An error occurred', err))
  }
  const retrieveChatId = async (userId2: any) => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/Chats/GetChatRoom`,
        {
          params: {
            user1: loggedUser?.id,
            user2: personData?.receiverId ? personData?.receiverId : userId2,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('Error retrieving chat ID:', error)
      throw new Error('Could not retrieve chat ID')
    }
  }
  const handleSendMessage = async () => {
    try {
      const chatId = await retrieveChatId(Number(personData?.id))

      const chatRoomProps: ChatRoomProps = {
        selectedRoom: chatId,
        contact: `${personData?.firstName} ${personData?.lastName}`,
        imageUri: personData?.profilePicture || '',
        firstName: personData?.firstName ? personData.firstName : 'First Name',
        lastName: personData?.lastName ? personData.firstName : 'Last Name',
        description: personData?.description || '',
        profilePicture: personData?.profilePicture || '',
        friendRequestStatus: personData?.friendRequestStatus || '',
        areFriends: personData?.areFriends || false,
        username: personData?.username || '',
        phoneNumber: personData?.phoneNumber || '',
        email: personData?.email || '',
        interest: personData?.interest || '',
        city: personData?.city || '',
        currentLocationId: personData?.currentLocationId
          ? parseInt(personData.currentLocationId)
          : 1,
        receiverId: personData?.receiverId || 0,
        notificationToken: personData?.notificationToken || '',
      }

      handleNavigation('ChatRoom', chatRoomProps)
    } catch (error) {
      console.error('Error navigating to chat:', error)
      showNotificationMessage('Failed to navigate to chat', 'fail')
    }
  }

  const handleSMS = () => {
    const phoneNumber = personData?.phoneNumber
    const smsUrl = `sms:${phoneNumber}`

    Linking.canOpenURL(smsUrl)
      .then((supported) => {
        if (!supported) {
          showNotificationMessage('SMS is not available', 'fail')
        } else {
          return Linking.openURL(smsUrl)
        }
      })
      .catch((err) => showNotificationMessage('An error occurred', 'fail'))
  }

  const deleteFriend = async (userId1: any, userId2: any) => {
    try {
      const response = await axios.delete(
        `${config.BASE_URL}/api/friend/${userId1}/${userId2}`,
      )
      if (response.status === 204) {
        alert('Friend removed successfully')
        setPersonData((prevData) => {
          if (
            prevData
            //    (prevData.receiverId === userId1 || prevData.receiverId === userId2)
          ) {
            return {
              ...prevData,
              friendRequestStatus: 'Send friend request',
              areFriends: false,
            }
          }
          return prevData
        })
      }
    } catch (error) {
      console.error('Error deleting friend:', error)
      alert('Failed to remove friend')
    }
  }
  async function sendPushNotification() {
    const message = [
      {
        to: personData?.notificationToken,
        sound: 'default',
        title: 'You have a new friend request',
        body: `${loggedUser?.firstName} ${loggedUser?.lastName} sent you a friend request!`,
        data: { someData: 'goToNotification' },
      },
    ]
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }
  const fetchLocation = useCallback(async () => {
    const location = await getLocation('lowest')
    if (location) {
      setCurrentLocation(location)
    }
  }, [])

  const handleConnect = async () => {
    try {
      const requestBody = {
        SenderId: loggedUser?.id,
        ReceiverId: personData?.id,
        Latitude: currentLocation.latitude,
        Longitude: currentLocation.longitude,
      }
      sendPushNotification()
      await axios.post(
        `${config.BASE_URL}/api/Friend/sendFriendRequest`,
        requestBody,
      )
      setPersonData((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            friendRequestStatus: 'Pending',
            areFriends: false,
          }
        }
        return prevData
      })
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    contactButtons: {
      marginVertical: 5,
      marginLeft: 10,

      width: '100%',
    },
    scrollContainer: {
      flex: 1,
    },
    personInfoContainer: {
      flex: 1,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    infoTextContainer: {
      flex: 1,
      marginTop: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalImage: {
      width: 370,
      height: 370,
      borderRadius: 20,
      margin: 30,
    },
    username: {
      fontSize: 24,
      fontWeight: '300',
      // marginLeft: 10,
      marginVertical: 3,
      color: 'white',
    },
    name: {
      fontSize: 16,
      marginBottom: 5,
      color: textColor,
    },
    info: {
      fontSize: 14,
      marginBottom: 3,
      color: textColor,
    },
    noPersonText: {
      textAlign: 'center',
      color: textColor,
      fontSize: 16,
    },
    contactButtonsText: {
      color: '#2089dc',
      fontSize: 18,
      padding: 3,
    },
    text: {
      fontSize: 32,
      fontWeight: '300',
      marginHorizontal: 20,
      color: textColor,
    },
  })

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ position: 'absolute', zIndex: 2 }}>
          <BackAction></BackAction>
        </View>
        {loading && (
          <Skeleton
            animation="wave"
            style={{
              width: '100%',
              position: 'absolute',
              height: 370,
              flex: 1,
              opacity: 0.7,
            }}
          />
        )}
        <ImageBackground
          source={require('../../assets/Untitled.png')}
          style={{
            width: '100%',
            position: 'absolute',
            height: 370,
            flex: 1,
            opacity: 0.7,
          }}
          resizeMode="cover"></ImageBackground>
        {personData ? (
          <View style={styles.personInfoContainer}>
            <View
              style={{
                alignItems: 'center',

                marginLeft: 10,
                marginTop: 20,
              }}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                {loading && (
                  <Skeleton
                    animation="wave"
                    style={[styles.avatar, { position: 'absolute', zIndex: 1 }]}
                  />
                )}
                <Image
                  source={
                    personData.profilePicture
                      ? {
                          uri: personData.profilePicture,
                        }
                      : require('../../assets/DefaultUserIcon.png')
                  }
                  style={styles.avatar}
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)}
                />
              </TouchableOpacity>
              <Text style={styles.username}>
                {personData.firstName} {personData.lastName.charAt(0)}{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  size={20}
                  name="location-on"
                  color={'white'}
                  style={{ paddingTop: 5 }}
                />
                <Text style={{ color: 'white', marginTop: 5 }}>
                  {personData.city}
                </Text>
              </View>
            </View>

            {personData.id != String(loggedUser?.id) &&
              loggedUser?.role !== 'agency' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 11,
                  }}>
                  <Button
                    title={
                      personData.friendRequestStatus === 'Accepted'
                        ? 'Unfriend'
                        : personData.friendRequestStatus === 'Pending'
                          ? 'Pending'
                          : 'Send friend request'
                    }
                    containerStyle={{
                      flex: 1,
                      marginRight: 5,
                      marginVertical: 10,
                    }}
                    icon={{
                      name: 'user',
                      type: 'font-awesome',
                      size: 15,
                      color: 'white',
                    }}
                    onPress={() => {
                      if (personData.friendRequestStatus === 'Accepted') {
                        deleteFriend(
                          personData.id ? personData.id : personData.receiverId,
                          loggedUser?.id,
                        )
                      } else if (personData.friendRequestStatus === 'Pending') {
                        showNotificationMessage(
                          'Friend request is already pending.',
                          'neutral',
                        )
                      } else {
                        handleConnect()
                      }
                    }}
                  />

                  <Button
                    onPress={handleSendMessage}
                    title={t('labels.message')}
                    containerStyle={{
                      flex: 1,
                      marginLeft: 5,
                      marginVertical: 10,
                    }}
                    icon={{
                      name: 'envelope',
                      type: 'font-awesome',
                      size: 15,
                      color: 'white',
                    }}
                    disabled={personData.friendRequestStatus != 'Accepted'}
                    buttonStyle={{ backgroundColor: 'rgba(199, 43, 98, 1)' }}
                    color={'black'}
                  />
                </View>
              )}
            <View style={styles.infoTextContainer}>
              <ProfileDetails data={userProfileData}></ProfileDetails>

              <View
                style={{
                  marginTop: 10,
                  marginHorizontal: 10,
                  backgroundColor: backgroundColorGrey,
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={handleEmail}
                  style={[styles.contactButtons]}>
                  <Text style={styles.contactButtonsText}>
                    {t('selectedPersonInfo.sendEmail')}
                  </Text>
                </TouchableOpacity>
                <LineComponent />
                <TouchableOpacity
                  onPress={handleCall}
                  style={styles.contactButtons}>
                  <Text style={styles.contactButtonsText}>
                    {t('selectedPersonInfo.call')}
                  </Text>
                </TouchableOpacity>
                <LineComponent />
                <TouchableOpacity
                  onPress={handleSMS}
                  style={styles.contactButtons}>
                  <Text style={styles.contactButtonsText}>
                    {t('selectedPersonInfo.sendSms')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.noPersonText}>
            {t('selectedPersonInfo.noPersonSelected')}
          </Text>
        )}

        <View></View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}>
          <View>
            <Image
              source={
                personData?.profilePicture
                  ? {
                      uri: personData.profilePicture,
                    }
                  : require('../../assets/DefaultUserIcon.png')
              }
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <FooterNavbar currentRoute="" />
    </View>
  )
}

export default SelectedPersonInfo

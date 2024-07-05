import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  ImageBackground,
} from 'react-native'

import FooterNavbar from '../Components/FooterNavbar'

import { ImageConfig } from '../config/imageConfig'

import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../Navigation/Types'
import { useNotification } from '../Components/Notification/NotificationProvider'
import ProfileDetails from '../Components/SettingSections/ProfileDetails'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import LineComponent from '../Components/LineComponent'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button } from '@rneui/base'

const SelectedPersonInfo: React.FC = () => {
  const { t } = useTranslation()

  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>()
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  // const personData = route.params?.personData
  const [personData, setPersonData] = useState(route.params?.personData)
  const { loggedUser } = useUser()
  const handleNavigation = useHandleNavigation()
  const userProfileData: {
    icon: string
    label: string
    value: string | number | undefined
  }[] = [
    { icon: 'location-city', label: 'City', value: personData?.city },
    { icon: 'alternate-email', label: 'Email', value: personData?.email },
    { icon: 'interests', label: 'Interest', value: personData?.interest },
    {
      icon: 'phone-callback',
      label: 'Phone Number',
      value: personData?.phoneNumber,
    },
    { icon: 'badge', label: 'Username', value: personData?.username },
  ]

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
      handleNavigation('Chat', { chatId: chatId })
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
            prevData &&
            (prevData.receiverId === userId1 || prevData.receiverId === userId2)
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

  const handleConnect = async (personId: number) => {
    try {
      const requestBody = {
        SenderId: loggedUser?.id,
        ReceiverId: personId,
      }

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
    username: {
      fontSize: 26,
      fontWeight: '400',
      marginLeft: 10,
      marginTop: 20,
      color: textColor,
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
      color: 'rgba(100,110,200,1)',
      fontSize: 18,
      padding: 5,
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
        {/*  <Text style={styles.text}>
          {t('selectedPersonInfo.userInformation')}
        </Text>*/}
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
                //  flexDirection: 'row',
                marginLeft: 10,
                marginTop: 20,
              }}>
              <Image
                source={
                  personData.profilePicture !== ''
                    ? {
                        uri:
                          ImageConfig.IMAGE_CONFIG + personData.profilePicture,
                      }
                    : require('../../assets/DefaultUserIcon.png')
                }
                style={styles.avatar}
              />
              <Text style={styles.username}>
                {personData.firstName} {personData.lastName}
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
                  {personData.city} {personData.receiverId}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
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
                  width: 200,
                  marginHorizontal: 5,
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
                    deleteFriend(personData.receiverId, loggedUser?.id) // Assuming currentUserId is defined
                  } else {
                    handleConnect(personData.receiverId)
                  }
                }}
              />

              <Button
                onPress={handleSendMessage}
                title={'Message'}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 5,
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

            <View style={styles.infoTextContainer}>
              <ProfileDetails data={userProfileData}></ProfileDetails>
              <View
                style={{
                  marginHorizontal: 5,
                  backgroundColor: backgroundColorGrey,
                  borderRadius: 10,
                  marginTop: 20,
                }}>
                {/*   <Text style={[styles.contactButtonsText, { color: 'white' }]}>
                  Friend Status:
                  {personData.friendRequestStatus === 'Accepted'
                    ? 'friends'
                    : personData.friendRequestStatus === 'Pending'
                      ? 'pending'
                      : 'Not friends'}
                </Text>*/}
              </View>
              <View
                style={{
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
                <LineComponent />
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

      <FooterNavbar currentRoute="" />
    </View>
  )
}

export default SelectedPersonInfo

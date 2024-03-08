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

interface Event {
  id: number
  eventImage: string
  onConnect: () => void
}

const SelectedPersonInfo: React.FC = () => {
  const { t } = useTranslation()

  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>()
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  const personData = route.params?.personData
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
    // Add more data as needed
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
      width: 70,
      height: 70,
      borderRadius: 50,
    },
    infoTextContainer: {
      flex: 1,
      marginTop: 15,
    },
    username: {
      fontSize: 26,
      fontWeight: '400',
      marginLeft: 10,
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
        <Text style={styles.text}>User Information</Text>
        {personData ? (
          <View style={styles.personInfoContainer}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
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
                UserName: {personData.username}
              </Text>
            </View>
            <View style={styles.infoTextContainer}>
              <ProfileDetails data={userProfileData}></ProfileDetails>
              <View
                style={{
                  marginHorizontal: 10,
                  backgroundColor: backgroundColorGrey,
                  borderRadius: 10,
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={handleEmail}
                  style={[styles.contactButtons]}>
                  <Text style={styles.contactButtonsText}>Send Email</Text>
                </TouchableOpacity>
                <LineComponent />
                <TouchableOpacity
                  onPress={handleCall}
                  style={styles.contactButtons}>
                  <Text style={styles.contactButtonsText}>Call</Text>
                </TouchableOpacity>
                <LineComponent />
                <TouchableOpacity
                  onPress={handleSMS}
                  style={styles.contactButtons}>
                  <Text style={styles.contactButtonsText}>Send SMS</Text>
                </TouchableOpacity>
                <LineComponent />

                <TouchableOpacity style={styles.contactButtons}>
                  <Text style={styles.contactButtonsText}>
                    Send Private Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.noPersonText}>No person selected</Text>
        )}

        <View></View>
      </ScrollView>

      <FooterNavbar currentRoute="" />
    </View>
  )
}

export default SelectedPersonInfo

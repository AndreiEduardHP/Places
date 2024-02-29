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

interface Event {
  id: number
  eventImage: string
  onConnect: () => void
}

const SelectedPersonInfo: React.FC = () => {
  const { t } = useTranslation()

  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>()
  const { showNotificationMessage } = useNotification()
  const personData = route.params?.personData

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {personData ? (
          <View style={styles.personInfoContainer}>
            <ImageBackground
              source={require('../../assets/zzz.jpg')}
              resizeMode="cover"
              style={styles.scrollContainer}>
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 30,
                  alignItems: 'center',
                }}>
                <Text style={styles.username}>
                  UserName: {personData.username}
                </Text>

                <Image
                  source={
                    personData.profilePicture !== ''
                      ? {
                          uri:
                            ImageConfig.IMAGE_CONFIG +
                            personData.profilePicture,
                        }
                      : require('../../assets/DefaultUserIcon.png')
                  }
                  style={styles.avatar}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.name}>
                  Name: {personData.firstName} {personData.lastName}
                </Text>
                <Text style={styles.info}>Interest: {personData.interest}</Text>
                <Text style={styles.info}>
                  Friends: {personData.areFriends ? 'Yes' : 'No'}
                </Text>
                <Text style={styles.info}>City: {personData.city}</Text>
                <Text style={styles.info}>Email: {personData.email}</Text>
                <Text style={styles.info}>
                  Friend Request Status:
                  {personData.friendRequestStatus
                    ? personData.friendRequestStatus
                    : 'No friend request sent'}
                </Text>
                <Text style={styles.info}>
                  Phone Number: {personData.phoneNumber}
                </Text>
                <TouchableOpacity
                  onPress={handleEmail}
                  style={[styles.contactButtons, { marginTop: 30 }]}>
                  <Text style={{ color: 'rgba(150,180,255,1)' }}>
                    Send Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCall}
                  style={styles.contactButtons}>
                  <Text style={{ color: 'rgba(150,180,255,1)' }}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSMS}
                  style={styles.contactButtons}>
                  <Text style={{ color: 'rgba(150,180,255,1)' }}>Send SMS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactButtons}>
                  <Text style={{ color: 'rgba(150,180,255,1)' }}>
                    Send Private Message
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactButtons: {
    marginTop: 5,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
  },
  personInfoContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoTextContainer: {
    flex: 1,
    marginHorizontal: 25,
    marginTop: 40,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  info: {
    fontSize: 14,
    marginBottom: 3,
    color: 'white',
  },
  noPersonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
})

export default SelectedPersonInfo

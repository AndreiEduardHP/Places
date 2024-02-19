import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  ScrollView,
  Linking,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import MapView, { Marker } from 'react-native-maps'
import { ImageConfig } from '../config/imageConfig'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { LinearGradient } from 'expo-linear-gradient'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../Navigation/Types'

interface Event {
  id: number
  eventImage: string
}

const SelectedPersonInfo: React.FC = () => {
  const { t } = useTranslation()

  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>()
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
          console.log('Phone number is not available')
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
          console.log('SMS is not available')
        } else {
          return Linking.openURL(smsUrl)
        }
      })
      .catch((err) => console.error('An error occurred', err))
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {personData ? (
          <View style={styles.personInfoContainer}>
            <View
              style={{ marginLeft: 20, marginRight: 30, alignItems: 'center' }}>
              <Text style={styles.username}>
                UserName: {personData.username}
              </Text>

              <Image
                source={{
                  uri:
                    personData.profilePicture !== ''
                      ? ImageConfig.IMAGE_CONFIG + personData.profilePicture
                      : 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png',
                }}
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
                style={styles.contactButtons}>
                <Text style={{ color: 'blue' }}>Send Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCall}
                style={styles.contactButtons}>
                <Text style={{ color: 'blue' }}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSMS}
                style={styles.contactButtons}>
                <Text style={{ color: 'blue' }}>Send SMS</Text>
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactButtons: {
    marginTop: 10,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
    //  flexGrow: 1,
    //  justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  personInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    //marginRight: 20,
  },
  infoTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    marginBottom: 3,
  },
  noPersonText: {
    textAlign: 'center',
    fontSize: 16,
  },
})

export default SelectedPersonInfo
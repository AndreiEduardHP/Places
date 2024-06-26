import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  TextInput,
} from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import Icon from 'react-native-vector-icons/MaterialIcons' // Import the icon library

import i18n from '../TranslationFiles/i18n'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { useNotification } from '../Components/Notification/NotificationProvider'

import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ImageConfig } from '../config/imageConfig'
import { formatDateAndTime } from '../Utils.tsx/Services/FormatDate'
import LoadingComponent from '../Components/Loading/Loading'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useFocusEffect } from '@react-navigation/native'
import * as Brightness from 'expo-brightness'

interface Event {
  id: number
  eventName: string
  otherRelevantInformation: string
  eventDescription: string
  eventTime: any
  eventLocation: {
    latitude: number
    longitude: number
  }
  locationDetails?: string
}

const JoinedEventsScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser } = useUser()
  const { backgroundColor, textColor } = useThemeColor()
  const navigate = useHandleNavigation()
  const [events, setEvents] = useState<Event[]>([])
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [currentQRCode, setCurrentQRCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentBrightness, setCurrentBrightness] = useState<any>(0)
  const [searchQuery, setSearchQuery] = useState('') // State for search query

  useEffect(() => {
    const fetchEvents = async () => {
      if (loggedUser?.id) {
        const apiUrl = `${config.BASE_URL}/api/userprofileevent/joinedevents/${loggedUser.id}`
        try {
          let response = await axios.get<Event[]>(apiUrl)
          const eventsWithLocation = await Promise.all(
            response.data.map(async (event) => {
              const locationDetails = await fetchLocationDetails(
                event.eventLocation.latitude,
                event.eventLocation.longitude,
              )
              return { ...event, locationDetails }
            }),
          )
          setEvents(eventsWithLocation)
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    }

    fetchEvents()
  }, [])

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAjpd8EvSYVtI-6tta5IXQYaIJp5PdCS8I`,
      )

      if (response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address
        return formattedAddress
      } else {
        return 'Location details not found'
      }
    } catch (error) {
      console.error('Error fetching location details:', error)
      return 'Error fetching location details'
    }
  }

  const fetchQRCode = async (eventId: number) => {
    const originalBrightness = await Brightness.getBrightnessAsync() // Save the current brightness
    setCurrentBrightness(originalBrightness) // Store it in state

    await Brightness.setBrightnessAsync(1.0) // Set brightness to 100%

    if (loggedUser?.id) {
      try {
        const response = await axios.get(
          `${config.BASE_URL}/api/userprofileevent/GetQRCode/${eventId}/${loggedUser?.id}`,
        )
        setCurrentQRCode(response.data.qrCode)

        setModalVisible(true)
      } catch (error) {
        setModalVisible(true)
        setCurrentQRCode(null)
        await Brightness.setBrightnessAsync(originalBrightness)
      }
    }
  }

  const renderItem = ({ item }: { item: Event }) => (
    <View style={styles.itemContainer}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{ width: '100%' }}>
          <View>
            <Text style={[styles.itemText, { color: textColor }]}>
              {t('myEvents.eventName')}: {item.eventName}
            </Text>
            <Text style={[styles.itemText, { color: textColor }]}>
              {t('myEvents.eventDescription')}: {item.eventDescription}
            </Text>
            <Text style={[styles.itemText, { color: textColor }]}>
              {t('eventForm.otherRelevantInformation')}:{' '}
              {item.otherRelevantInformation}
            </Text>
            <Text style={[styles.itemText, { color: textColor }]}>
              {t('myEvents.eventTime')}:{' '}
              {formatDateAndTime(new Date(item.eventTime))}
            </Text>
            <Text style={[styles.itemText, { color: textColor }]}>
              {t('myEvents.eventLocation')}: {item.locationDetails}
            </Text>
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                navigate('MapScreen', {
                  latitude: item.eventLocation.latitude,
                  longitude: item.eventLocation.longitude,
                })
              }
              style={{
                backgroundColor: 'rgba(205,10,30,1)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 300,
                marginTop: 10,
                borderRadius: 10,
                height: 30,
              }}>
              <Text style={{ color: 'white' }}>
                {t('myEvents.seeLocationOnMap')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => fetchQRCode(item.id)}
              style={{
                backgroundColor: 'rgba(55,150,200,1)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 300,
                marginTop: 10,
                borderRadius: 10,
                height: 30,
              }}>
              <Text style={{ color: 'white' }}>{t('myEvents.seeQR')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )

  const styles = StyleSheet.create({
    containerScroll: {
      flexGrow: 1,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    qrCodeImage: {
      width: 400,
      height: 400,
      borderRadius: 10,
    },
    itemContainer: {
      backgroundColor: 'rgba(200,200,200,0.3)',
      margin: 5,
      borderRadius: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    itemText: {
      fontSize: 18,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 32,
      fontWeight: '300',
      marginHorizontal: 10,
      color: textColor,
    },
    content: {
      justifyContent: 'center',
      padding: 10,
    },
    dropdown: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: textColor,
      paddingRight: 30,
    },
    header: {
      fontSize: 28,
      fontWeight: '400',
      margin: 20,
      color: textColor,
    },
    logoutButton: {
      marginTop: 20,
      color: 'blue',
      textDecorationLine: 'underline',
    },
    noUserText: {
      fontSize: 16,
      color: 'red',
    },
    footer: {
      padding: 10,
      justifyContent: 'flex-end',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 5,

      marginTop: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 18,
      borderColor: textColor,
      borderWidth: 1,
      color: textColor,
      fontSize: 16,
    },
    searchInput: {
      flex: 1,

      color: textColor,
      fontSize: 16,
    },
    clearIcon: {
      marginLeft: 10,
    },
  })

  // Filter events based on search query
  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return isLoading ? (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <LoadingComponent />
      </View>

      <View>
        <FooterNavbar currentRoute={''} />
      </View>
    </View>
  ) : events === null || events.length === 0 ? (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: textColor,
            fontSize: 36,
          }}>
          No joined events found
        </Text>
      </View>

      <View>
        <FooterNavbar currentRoute={''} />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>{t('myEvents.joinedEvents')}:</Text>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('myEvents.searchPlaceholder')}
          placeholderTextColor={textColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={() => setSearchQuery('')}
          style={styles.clearIcon}>
          <Icon name="clear" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          {currentQRCode ? (
            <Image
              source={{ uri: `${ImageConfig.IMAGE_CONFIG}${currentQRCode}` }}
              style={styles.qrCodeImage}
            />
          ) : (
            <Text style={{ color: 'white' }}>
              {t('myEvents.noQrAvailable')}
            </Text>
          )}
          <TouchableOpacity
            onPress={async () => {
              setModalVisible(false)
              await Brightness.setBrightnessAsync(currentBrightness)
            }}
            style={{
              marginTop: 20,
              backgroundColor: 'white',
              padding: 10,
              width: 100,
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
              }}>
              {t('buttons.close')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

export default JoinedEventsScreen

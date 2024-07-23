import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
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
import { Button, Overlay, Card, SearchBar } from '@rneui/themed'
import BackAction from '../Components/Back'

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
  const [isOverlayVisible, setOverlayVisible] = useState<boolean>(false)
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

        setOverlayVisible(true)
      } catch (error) {
        setOverlayVisible(true)
        setCurrentQRCode(null)
        await Brightness.setBrightnessAsync(originalBrightness)
      }
    }
  }

  const renderItem = ({ item }: { item: Event }) => (
    <Card containerStyle={styles.cardContainer}>
      <Card.Title
        style={{
          color: textColor,
          fontSize: 24,
          margin: 0,
        }}>
        Event Name
      </Card.Title>
      <Text
        style={{
          color: textColor,
          fontSize: 22,
          textAlign: 'center',
          marginTop: -15,
          marginBottom: 5,
        }}>
        {item.eventName}
      </Text>
      <Card.Divider />
      <Text style={[styles.itemText, { color: textColor }]}>
        {t('myEvents.eventDescription')}: {item.eventDescription}
      </Text>
      <Text style={[styles.itemText, { color: textColor }]}>
        {t('eventForm.otherRelevantInformation')}:{' '}
        {item.otherRelevantInformation}
      </Text>
      <Text style={[styles.itemText, { color: textColor }]}>
        {t('myEvents.eventTime')}: {formatDateAndTime(new Date(item.eventTime))}
      </Text>
      <Text style={[styles.itemText, { color: textColor }]}>
        {t('myEvents.eventLocation')}: {item.locationDetails}
      </Text>

      <Button
        onPress={() =>
          navigate('MapScreen', {
            latitude: item.eventLocation.latitude,
            longitude: item.eventLocation.longitude,
          })
        }
        // style={styles.mapButton}
        containerStyle={{ marginVertical: 10 }}
        buttonStyle={{ backgroundColor: 'red' }}>
        <Text style={{ color: 'white' }}>{t('myEvents.seeLocationOnMap')}</Text>
      </Button>
      <Button
        onPress={() => fetchQRCode(item.id)} //style={styles.qrButton}
      >
        <Text style={{ color: 'white' }}>{t('myEvents.seeQR')}</Text>
      </Button>
    </Card>
  )

  const styles = StyleSheet.create({
    containerScroll: {
      flexGrow: 1,
    },
    overlayContainer: {
      padding: 20,
      alignItems: 'center',
      borderRadius: 10,
    },
    qrCodeImage: {
      width: 400,
      height: 400,
      borderRadius: 10,
    },
    cardContainer: {
      borderRadius: 10,
      backgroundColor:
        textColor == 'white' ? 'rgba(48, 51, 55,1)' : 'rgba(222,222,222,1)',
    },
    itemText: {
      fontSize: 14,
      marginBottom: 5,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 32,
      fontWeight: '300',
      // marginHorizontal: 10,
      color: textColor,
    },
    mapButton: {
      backgroundColor: 'rgba(205,10,30,1)',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: 10,
      borderRadius: 10,
      height: 30,
    },
    qrButton: {
      backgroundColor: 'rgba(55,150,200,1)',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: 10,
      borderRadius: 10,
      height: 30,
    },
    header: {
      fontSize: 28,
      fontWeight: '400',
      margin: 20,
      color: textColor,
    },
    footer: {
      padding: 10,
      justifyContent: 'flex-end',
    },
    searchInputContainer: {
      marginHorizontal: 5,
      //  marginVertical: 5,
      marginTop: 10,
    },
  })

  // Filter events based on search query
  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().startsWith(searchQuery.toLowerCase()),
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BackAction
          style={{ backgroundColor: 'white', width: 26, height: 26 }}
        />
        <Text style={styles.text}>{t('myEvents.joinedEvents')}:</Text>
      </View>
      <View style={styles.searchInputContainer}>
        <SearchBar
          placeholder={t('myEvents.searchPlaceholder')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          lightTheme={textColor == 'white' ? false : true}
          containerStyle={{
            backgroundColor: backgroundColor,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={
            {
              //  backgroundColor: backgroundColor,
            }
          }
          inputStyle={{ color: textColor }}
        />
      </View>
      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={async () => {
          setOverlayVisible(false)
          await Brightness.setBrightnessAsync(currentBrightness)
        }}
        animationType="slide"
        overlayStyle={{ backgroundColor: 'transparent' }}>
        <View style={styles.overlayContainer}>
          {currentQRCode ? (
            <Image
              source={{ uri: `${ImageConfig.IMAGE_CONFIG}${currentQRCode}` }}
              style={styles.qrCodeImage}
            />
          ) : (
            <Text style={{ color: 'black' }}>
              {t('myEvents.noQrAvailable')}
            </Text>
          )}
          <Button
            title={t('buttons.close')}
            onPress={async () => {
              setOverlayVisible(false)
              await Brightness.setBrightnessAsync(currentBrightness)
            }}
            containerStyle={{ marginTop: 10, width: 200 }}
            buttonStyle={{ borderRadius: 10 }}
          />
        </View>
      </Overlay>
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

export default JoinedEventsScreen

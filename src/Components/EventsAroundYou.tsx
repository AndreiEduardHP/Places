import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { ImageConfig } from '../config/imageConfig'
import LoadingComponent from './Loading/Loading'
import { remoteImages } from '../AzureImages/Images'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useTranslation } from 'react-i18next'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Card, Title, Paragraph } from 'react-native-paper'
import { SearchBar, Button, ButtonGroup } from '@rneui/base'
import { Picker } from '@react-native-picker/picker'
import { useUser } from '../Context/AuthContext'

import LineComponent from './LineComponent'

type Event = {
  id: number
  eventName: string
  eventDescription: string
  eventImage: string
  eventTime: string
  locationLatitude: number
  locationLongitude: number
}

const Item: React.FC<Event> = ({
  eventName,
  eventDescription,
  eventImage,
  eventTime,
  locationLatitude,
  locationLongitude,
}) => {
  const [locationAddress, setLocationAddress] = useState<string>('')
  const navigate = useHandleNavigation()
  const { textColor, backgroundColor } = useThemeColor()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchLocation = async () => {
      const address = await fetchLocationDetails(
        locationLatitude,
        locationLongitude,
      )
      setLocationAddress(address)
    }

    fetchLocation()
  }, [locationLatitude, locationLongitude])

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

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const dayName = days[date.getUTCDay()]
    const day = date.getUTCDate()
    const month = months[date.getUTCMonth()]
    const year = date.getUTCFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${dayName} ${day} ${month} ${year} ${hours}:${minutes}`
  }
  const styles = StyleSheet.create({
    title: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
      paddingLeft: 10,
      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
    searchInput: {
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 1,
      borderRadius: 10,
      borderColor: textColor,
      borderWidth: 1,
      marginRight: 15,
      color: textColor,
      fontSize: 15,
    },
    card: {
      backgroundColor:
        textColor == 'white' ? 'rgba(48, 51, 55,1)' : 'rgba(122,212,112,1)',
      margin: 10,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    icon: {
      marginRight: 5,
    },
    dateAndTime: {
      fontSize: 16,
      color: textColor,
      marginTop: 5,
    },
    locationAddress: {
      fontSize: 16,
      color: textColor,
      textAlign: 'left',
      paddingRight: 15,
    },
  })

  return (
    <Card style={styles.card}>
      <Card.Cover
        source={
          eventImage && eventImage !== ''
            ? { uri: ImageConfig.IMAGE_CONFIG + eventImage }
            : { uri: remoteImages.partyImage }
        }
      />
      <Card.Content>
        <Title style={{ color: textColor }}>Event name: {eventName}</Title>
        <Paragraph style={{ color: textColor, marginBottom: 10 }}>
          Event description: {eventDescription}
        </Paragraph>
        <LineComponent />
        <View style={styles.infoContainer}>
          <MaterialIcons
            name="calendar-month"
            size={26}
            color={textColor}
            style={styles.icon}
          />
          <Text style={styles.dateAndTime}>{formatEventDate(eventTime)}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons
            name="location-on"
            size={26}
            color={textColor}
            style={styles.icon}
          />
          <Text style={styles.locationAddress}>{locationAddress}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          buttonStyle={{
            backgroundColor: 'rgba(10,10,10,1)',
          }}
          titleStyle={{ fontWeight: '400', fontSize: 18 }}
          containerStyle={{
            marginVertical: 5,

            width: 210,
          }}
          onPress={() =>
            navigate('MapScreen', {
              latitude: locationLatitude,
              longitude: locationLongitude,
            })
          }>
          {t('eventsAroundYou.seeLocationOnMap')}
        </Button>
      </Card.Actions>
    </Card>
  )
}

const haversineDistance = (
  coords1: { latitude: any; longitude: any },
  coords2: { latitude: any; longitude: any },
) => {
  function toRad(x: number) {
    return (x * Math.PI) / 180
  }

  const lat1 = coords1.latitude
  const lon1 = coords1.longitude
  const lat2 = coords2.latitude
  const lon2 = coords2.longitude

  const R = 6371 // Radius of the Earth in km

  const x1 = lat2 - lat1
  const dLat = toRad(x1)
  const x2 = lon2 - lon1
  const dLon = toRad(x2)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  return d
}

const EventsAroundYou: React.FC = () => {
  const [eventData, setEventData] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('') // State for search query
  const [distance, setDistance] = useState(5) // State for distance filter
  const { textColor } = useThemeColor()
  const { loggedUser } = useUser()
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    fetchEvents()
  }, [distance]) // Fetch events when the distance changes

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${config.BASE_URL}/api/Event`)
      const events = response.data

      const filteredEvents = events.filter(
        (event: { locationLatitude: any; locationLongitude: any }) => {
          const eventCoords = {
            latitude: event.locationLatitude,
            longitude: event.locationLongitude,
          }
          if (loggedUser) {
            const userCoords = {
              latitude: loggedUser.currentLatitude,
              longitude: loggedUser.currentLongitude,
            }
            const distanceBetween = haversineDistance(userCoords, eventCoords)
            setIsLoading(false)
            return distanceBetween <= distance
          }
        },
      )

      setEventData(filteredEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderItem = ({ item }: { item: Event }) => (
    <Item
      eventName={item.eventName}
      eventDescription={item.eventDescription}
      eventImage={item.eventImage}
      id={item.id}
      eventTime={item.eventTime}
      locationLatitude={item.locationLatitude}
      locationLongitude={item.locationLongitude}
    />
  )

  const { t } = useTranslation()

  const styles = StyleSheet.create({
    title: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
      paddingLeft: 10,
      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
    searchInput: {
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 1,
      borderRadius: 10,
      borderColor: textColor,
      borderWidth: 1,
      marginRight: 15,
      color: textColor,
      fontSize: 15,
    },
    card: {
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    icon: {
      marginRight: 5,
    },
    dateAndTime: {
      fontSize: 16,
      color: textColor,
      marginTop: 5,
    },
    locationAddress: {
      fontSize: 16,
      color: textColor,
    },
    pickerContainer: {
      marginHorizontal: 15,
      marginTop: 10,
      borderColor: textColor,
      borderWidth: 1,
      borderRadius: 10,
    },
    picker: {
      height: 50,
      width: '100%',
    },
  })

  // Filter data based on search query
  const filteredData = eventData.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingComponent />
        <View style={{}}>
          <SearchBar
            lightTheme={textColor == 'white' ? false : true}
            containerStyle={{ backgroundColor: 'transparent' }}
            placeholder={t('eventsAroundYou.searchPlaceholder')}
            placeholderTextColor={textColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.title}>
            {t('eventsAroundYou.eventsAroundYou')}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{}}>
        <View>
          <SearchBar
            lightTheme={textColor == 'white' ? false : true}
            containerStyle={{ backgroundColor: 'transparent' }}
            placeholder={t('eventsAroundYou.searchPlaceholder')}
            placeholderTextColor={textColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.title}>
            {t('eventsAroundYou.eventsAroundYou')}
          </Text>
        </View>
        <ButtonGroup
          selectedButtonStyle={{ backgroundColor: 'black' }}
          buttons={['10Km', '50Km', 'All']}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value)
            setDistance(
              value == 0
                ? 10
                : value == 1
                  ? 50
                  : value == 2
                    ? 100000000000
                    : 999999,
            )
          }}
          containerStyle={{ marginBottom: 20 }}
        />
      </View>

      <FlatList
        data={filteredData}
        windowSize={4}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={false}
      />
    </View>
  )
}

export default EventsAroundYou

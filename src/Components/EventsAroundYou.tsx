import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { ImageConfig } from '../config/imageConfig'
import LoadingComponent from './Loading/Loading'
import { remoteImages } from '../AzureImages/Images'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Card, Title, Paragraph } from 'react-native-paper'
import { SearchBar, Button, ButtonGroup, Skeleton } from '@rneui/base'
import { useUser } from '../Context/AuthContext'
import { CheckBox as C } from '@rneui/base'
import LineComponent from './LineComponent'
import { Divider } from 'native-base'
import { interests } from '../Utils.tsx/Enums/Interests'
import ImageModal from '../Modals/ImageModal'
import * as Location from 'expo-location'
import { t } from 'i18next'
import { fetchLocationDetails } from '../Services/LocationDetails'
import { getLocation } from '../Services/CurrentLocation'
import { useFocusEffect } from '@react-navigation/native'
import ImageCarousel from './ImageCarousel/ImageCarousel'

type Event = {
  id: number
  eventName: string
  eventDescription: string
  eventImage: string
  eventTime: string
  locationLatitude: number
  locationLongitude: number
  interest: string
  eventAlbumImages: {
    imageUrl: string
  }[]
}

const Item: React.FC<Event & { additionalStyles?: object }> = ({
  eventName,
  eventDescription,
  eventImage,
  eventTime,
  locationLatitude,
  eventAlbumImages,
  interest,
  locationLongitude,
  additionalStyles,
}) => {
  const [locationAddress, setLocationAddress] = useState<string>('')
  const navigate = useHandleNavigation()
  const { textColor, backgroundColor } = useThemeColor()
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [imageToDownload, setImageToDownload] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAlbumModal, setAlbumModal] = useState(false)
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

  const handleImageClick = () => {
    setImageToDownload(eventImage)
    setIsImageModalVisible(true)
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
        textColor == 'white' ? 'rgba(48, 51, 55,1)' : 'rgba(252,252,255,1)',
      marginHorizontal: 10,
      marginBottom: 20,
      ...additionalStyles,
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalImage: {
      width: 300,
      height: 300,
      marginBottom: 20,
    },
    closeModalButton: {
      backgroundColor: '#00B0EF',
      padding: 10,
      borderRadius: 5,
    },
    closeModalButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
    },
    imageContainer: {
      //  justifyContent: 'center',
      //  alignItems: 'center',
    },
  })

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={handleImageClick}>
        {!isLoaded && (
          <Skeleton
            animation="wave"
            style={{
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              height: '100%',
            }}
          />
        )}
        <Card.Cover
          source={
            eventImage && eventImage !== '' && eventImage !== ' '
              ? { uri: eventImage }
              : { uri: remoteImages.partyImage }
          }
          onLoadEnd={() => setIsLoaded(true)}
        />
      </TouchableOpacity>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Title style={{ color: textColor }}>Event name: {eventName}</Title>
            <Paragraph style={{ color: textColor, marginBottom: 10 }}>
              Event description: {eventDescription}
            </Paragraph>
          </View>
          {eventAlbumImages && eventAlbumImages.length > 0 ? (
            <TouchableOpacity
              onPress={() => setAlbumModal(true)}
              style={{ alignContent: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="collections" size={30} color={textColor} />
            </TouchableOpacity>
          ) : null}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAlbumModal}
          onRequestClose={() => setAlbumModal(false)}>
          <View
            style={{
              width: '100%',
              height: '90%',

              justifyContent: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                margin: 5,
                borderRadius: 7,
                backgroundColor: 'white',
              }}>
              <Text
                style={{ fontSize: 24, color: 'black', marginVertical: 10 }}>
                {t('Event Images')}
              </Text>

              <ImageCarousel
                images={eventAlbumImages.map(
                  (image) => image.imageUrl,
                )}></ImageCarousel>
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  borderRadius: 10,
                  width: 221,
                  marginVertical: 10,
                  alignItems: 'center',
                }}
                onPress={() => setAlbumModal(false)}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 22,
                    padding: 5,
                  }}>
                  {t('buttons.close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
      <ImageModal
        visible={isImageModalVisible}
        imageUrl={eventImage}
        onClose={() => setIsImageModalVisible(false)}
      />
    </Card>
  )
}

export const haversineDistance = (
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

  const R = 6371

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
  const [searchQuery, setSearchQuery] = useState('')
  const [distance, setDistance] = useState(5)
  const { textColor } = useThemeColor()
  const { loggedUser, refreshData } = useUser()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isInterestModalVisible, setIsInterestModalVisible] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<any>(null)

  useEffect(() => {
    fetchLocation()
  }, [distance, selectedIndex])
  const fetchLocation = useCallback(async () => {
    const location = await getLocation('lowest')
    if (location) {
      setCurrentLocation(location)
    }
  }, [])
  useEffect(() => {
    if (currentLocation) {
      fetchEvents()
    }
  }, [currentLocation, distance])

  useFocusEffect(
    useCallback(() => {
      if (currentLocation) {
        fetchEvents()
      }
    }, [currentLocation, distance]),
  )

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

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

          const userCoords = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }

          const distanceBetween = haversineDistance(userCoords, eventCoords)

          return distanceBetween <= distance
        },
      )
      setIsLoading(false)
      setEventData(filteredEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const renderItem = ({ item, index }: { item: Event; index: number }) => (
    <Item
      eventName={item.eventName}
      eventDescription={item.eventDescription}
      eventImage={item.eventImage}
      id={item.id}
      interest={item.interest}
      eventTime={item.eventTime}
      locationLatitude={item.locationLatitude}
      locationLongitude={item.locationLongitude}
      eventAlbumImages={item.eventAlbumImages}
      additionalStyles={
        index === 0
          ? { marginTop: 10 }
          : index === filteredData.length - 1
            ? { marginBottom: 40 }
            : {}
      }
    />
  )

  const styles = StyleSheet.create({
    title: {
      //  marginLeft: 10,
      //  marginTop: 10,
      fontSize: 23,
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginHorizontal: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 0,
      borderRadius: 10,
      width: '100%',
      maxHeight: '80%',
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    modalOption: {
      color: 'white',
      textAlign: 'center',
      // marginTop: 20,
      fontSize: 20,
    },
  })

  const filteredData = eventData.filter((event) => {
    const matchesSearchQuery = event.eventName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesInterests =
      selectedInterests.length === 0 ||
      selectedInterests.some((interest) =>
        event.interest.split(',').includes(interest),
      )
    return matchesSearchQuery && matchesInterests
  })

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={{ flex: 1 }}>
          <LoadingComponent />
          <View>
            <SearchBar
              containerStyle={{
                backgroundColor: 'transparent',

                paddingVertical: 5,
                borderTopWidth: 0,
                borderBottomWidth: 0,
              }}
              inputContainerStyle={{
                backgroundColor:
                  textColor === 'white'
                    ? 'rgba(35,35,35,1)'
                    : 'rgba(225,225,225,1)',
                height: 34,
              }}
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
      ) : (
        <View style={{ flex: 1 }}>
          <SearchBar
            containerStyle={{
              backgroundColor: 'transparent',
              paddingVertical: 5,

              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            inputContainerStyle={{
              backgroundColor:
                textColor === 'white'
                  ? 'rgba(35,35,35,1)'
                  : 'rgba(225,225,225,1)',
              height: 34,
            }}
            inputStyle={{ color: textColor }}
            placeholder={t('eventsAroundYou.searchPlaceholder')}
            placeholderTextColor={textColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>
              {t('eventsAroundYou.eventsAroundYou')}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <MaterialIcons
                name="filter-list"
                size={26}
                color={textColor}
                style={{ marginRight: 20 }}
              />
            </TouchableOpacity>
          </View>

          {filteredData.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text style={{ color: textColor, fontSize: 32 }}>
                {t('labels.noEventsAroundYou')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              windowSize={4}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
            />
          )}
        </View>
      )}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={[
                styles.title,
                {
                  color: 'black',
                  fontSize: 24,
                  marginVertical: 10,
                  fontWeight: '400',
                },
              ]}>
              {t('labels.selectInterest')}
            </Text>
            <Divider />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {interests.map((interest) => (
                <C
                  key={interest}
                  title={interest}
                  checked={selectedInterests.includes(interest)}
                  onPress={() => toggleInterest(interest)}
                  containerStyle={{
                    justifyContent: 'space-between',
                    width: 250,
                    margin: 0,
                    marginTop: 10,
                    padding: 0,
                  }}
                />
              ))}
            </ScrollView>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '500',
                padding: 10,
              }}>
              {t('labels.selectRadiusEvents')}
            </Text>
            <ButtonGroup
              selectedButtonStyle={{ backgroundColor: 'black' }}
              buttons={['10Km', '50Km', 'All']}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value)
                setDistance(value === 0 ? 10 : value === 1 ? 50 : 100000000000)
              }}
              containerStyle={{ marginBottom: 10 }}
            />
            <Button
              onPress={() => setIsModalVisible(false)}
              buttonStyle={{ backgroundColor: 'black', margin: 10 }}>
              <Text style={styles.modalOption}>{t('buttons.close')}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default EventsAroundYou

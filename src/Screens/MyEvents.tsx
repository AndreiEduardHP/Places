import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  Modal,
  Image,
} from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import DarkMode from '../Components/SwitchDarkMode'
import RNPickerSelect from 'react-native-picker-select'
import i18n from '../TranslationFiles/i18n'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { useNotification } from '../Components/Notification/NotificationProvider'
import SupportTicket from '../Components/SupportTicket'
import ChatComponent from './test200'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import ProfileSection from '../Components/SettingSections/ProfileSection'
import InformationSection from '../Components/SettingSections/Information'
import AccountSection from '../Components/SettingSections/AccountSettings'
import EventSection from '../Components/SettingSections/EventSection'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AccountPreference from '../Components/SettingSections/AccountPreference'
import { ImageConfig } from '../config/imageConfig'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { formatDateAndTime } from '../Utils.tsx/Services/FormatDate'
import LoadingComponent from '../Components/Loading/Loading'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import LineComponent from '../Components/LineComponent'

interface Event {
  id: number
  eventName: string
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
  const { loggedUser, refreshData } = useUser()
  const { backgroundColor, textColor } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  const navigate = useHandleNavigation()
  const [events, setEvents] = useState<Event[]>([])
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [currentQRCode, setCurrentQRCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchEvents = async () => {
      if (loggedUser?.id) {
        const apiUrl = `${config.BASE_URL}/api/userprofileevent/joinedevents/${loggedUser.id}`
        try {
          let response = await axios.get<Event[]>(apiUrl)
          const eventsWithLocation = await Promise.all(
            response.data.map(async (event) => {
              // Prefetch location details here
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
          console.error('Error fetching joined events:', error)
        }
      }
    }

    fetchEvents()
  }, [loggedUser?.id])

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
    console.log(eventId)
    console.log(loggedUser?.id)
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
              Event name: {item.eventName}
            </Text>
            <Text style={[styles.itemText, { color: textColor }]}>
              Event Description: {item.eventDescription}
            </Text>
            <Text style={[styles.itemText, { color: textColor }]}>
              Event Time: {formatDateAndTime(new Date(item.eventTime))}
            </Text>
            <Text style={[styles.itemText, { color: textColor }]}>
              Event Location: {item.locationDetails}
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
                backgroundColor: 'rgba(255,255,255,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 300,
                marginTop: 10,
                borderRadius: 10,
                height: 30,
              }}>
              <Text style={{ color: 'white' }}>See location on map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => fetchQRCode(item.id)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 300,
                marginTop: 10,
                borderRadius: 10,
                height: 30,
              }}>
              <Text style={{ color: 'white' }}>See QR</Text>
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    qrCodeImage: {
      width: 400,
      height: 400,
      borderRadius: 10,
    },
    itemContainer: {
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
  })
  return isLoading ? (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <LoadingComponent />
      </View>

      <View>
        <FooterNavbar currentRoute={''} />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>Joined Events:</Text>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          {currentQRCode ? (
            <Image
              source={{ uri: `${ImageConfig.IMAGE_CONFIG}${currentQRCode}` }}
              style={styles.qrCodeImage}
            />
          ) : (
            <Text style={{ color: 'white' }}>No QR available</Text>
          )}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
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
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

export default JoinedEventsScreen

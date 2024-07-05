import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'

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
import { CameraView, Camera } from 'expo-camera'
import EditEventForm from '../Components/EditEventForm'
import { MapMarkerDetail } from '../Interfaces/IUserData'
import Icon from 'react-native-vector-icons/MaterialIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { remoteImages } from '../AzureImages/Images'
import ParticipantsListContainer from '../Components/EventParticipants'
import { Button, Card, Overlay, SearchBar } from '@rneui/base'

interface Event {
  id: number
  eventName: string
  eventDescription: string
  eventTime: any
  otherRelevantInformation: string
  eventImage: string
  maxParticipants: number
  eventLocation: {
    latitude: number
    longitude: number
  }
  locationDetails?: string
}

const EventsCreatedByMe: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser } = useUser()
  const { backgroundColor, textColor } = useThemeColor()
  const navigate = useHandleNavigation()
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasPermission, setHasPermission] = useState<any>(null)
  const [scanned, setScanned] = useState<any>(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [event, setEvent] = useState<Event>()
  const [participantsCount, setParticipantsCount] = useState(0)
  const { showNotificationMessage } = useNotification()

  const fetchEvents = async () => {
    if (loggedUser?.id) {
      const apiUrl = `${config.BASE_URL}/api/userprofileevent/GetMyEventsByUser/${loggedUser.id}`
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
  const deleteEventAsync = async (eventId: number | undefined) => {
    if (loggedUser?.id) {
      const apiUrl = `${config.BASE_URL}/api/event/deleteEvent/${eventId}`
      try {
        let response = await axios.put(apiUrl)
        if (response) {
          showNotificationMessage('Event deleted succesfully!', 'success')
          setIsDeleteModalVisible(!isDeleteModalVisible)
          //   console.log(eventId)
          fetchEvents()
        } else {
          showNotificationMessage(
            'Something went wrong please try again!',
            'fail',
          )
        }
      } catch (error) {
        showNotificationMessage(
          'Something went wrong please try again!',
          'fail',
        )
      }
    }
  }
  useEffect(() => {
    fetchEvents()
  }, [])
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
      // console.log(hasPermission)
    }

    getCameraPermissions()
  }, [])

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true)

    const parsedData = parseQRData(data)
    //console.log(parsedData.userid)
    // console.log(selectedEvent)
    try {
      const apiUrl = `${config.BASE_URL}/api/userprofileevent/checkIfUserJoined?eventId=${selectedEvent}&userId=${parsedData.userid}`
      const response = await axios.get(apiUrl)

      if (response.data) {
        Alert.alert('Check In Status', 'User has joined the event.')
      } else {
        Alert.alert('Check In Status', 'User has not joined the event.')
      }
    } catch (error) {
      console.error('Error checking user join status:', error)
      Alert.alert(
        'Error',
        'An error occurred while checking if the user joined the event.',
      )
    }
  }
  interface QRData {
    [key: string]: number
  }

  const deleteEvent = (eventId: number | undefined) => {
    deleteEventAsync(eventId)
  }

  const handleOpenModal = (event: Event) => {
    setIsModalVisible(true)
    setEvent(event)
  }

  const handleOpenDeleteModal = (event: Event) => {
    setIsDeleteModalVisible(true)
    setEvent(event)
  }

  const parseQRData = (data: string): QRData => {
    let info: QRData = {}
    const pairs = data.split(',')
    pairs.forEach((pair) => {
      const [key, value] = pair.split(':')
      info[key.trim().toLowerCase()] = parseInt(value.trim())
    })
    return info
  }

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

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderItem = ({ item }: { item: Event }) => (
    <Card containerStyle={styles.cardContainer}>
      <Card.Title style={styles.cardTitle}>Event Name</Card.Title>
      <Text
        style={[
          styles.itemText,
          {
            color: textColor,
            textAlign: 'center',
            fontSize: 20,
            marginBottom: 10,
            marginTop: -15,
          },
        ]}>
        {item.eventName}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => {
            handleOpenModal(item)
          }}
          style={{ marginLeft: 5, paddingTop: 1 }}>
          <Icon
            name="edit"
            size={26}
            color={textColor}
            style={{ marginBottom: 4 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleOpenDeleteModal(item)
          }}
          style={{ marginRight: 5, paddingTop: 1 }}>
          <Icon name="delete" size={28} color={textColor} />
        </TouchableOpacity>
      </View>
      <Card.Divider />
      <Card.Image
        style={{ padding: 0, marginBottom: 10 }}
        source={
          item.eventImage
            ? {
                uri: item.eventImage,
              }
            : { uri: remoteImages.partyImage }
        }
        // resizeMode="contain"
      />

      <ParticipantsListContainer
        eventId={Number(item.id)}
        textColor={textColor}
        shouldRefreshParticipants={true}
        updateParticipantsCount={setParticipantsCount}
      />

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
        title={t('myEvents.seeLocationOnMap')}
        buttonStyle={styles.mapButton}
      />
      <Button
        onPress={() => {
          setModalVisible(true)
          setSelectedEvent(item.id)
        }}
        title="Check User"
        buttonStyle={styles.checkUserButton}
      />
    </Card>
  )

  const styles = StyleSheet.create({
    searchInput: {
      borderColor: 'gray',
      flex: 1,

      color: textColor,
    },
    cardContainer: {
      borderRadius: 10,
      backgroundColor:
        textColor == 'white' ? 'rgba(48, 51, 55,1)' : 'rgba(222,222,222,1)',
    },
    cardTitle: {
      color: textColor,
      fontSize: 24,
      margin: 0,
    },
    checkUserButton: {
      backgroundColor: 'rgba(55,150,200,1)',
    },
    itemText: {
      fontSize: 14,
      marginBottom: 5,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    searchInputContainer: {
      marginHorizontal: 5,
      marginTop: 10,
    },
    mapButton: {
      backgroundColor: 'rgba(205,10,30,1)',
      marginVertical: 10,
    },
    containerScroll: {
      flexGrow: 1,
    },
    modalHeader: {
      marginBottom: 5,
      width: '100%',
      flexDirection: 'row',

      justifyContent: 'flex-end',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
    },
    modalView: {
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      //elevation: 5,
    },
    button: {
      borderRadius: 50,
      padding: 5,

      width: 36,
    },
    buttonClose: {
      backgroundColor: 'black',
    },

    modalText: {
      marginTop: 15,
      textAlign: 'center',
    },
    traficInfoContainer: {
      alignItems: 'center',
      padding: 10,

      marginHorizontal: 5,
      marginBottom: 5,
    },
    closeTraficInfo: {
      alignItems: 'center',

      justifyContent: 'center',
      marginTop: 5,
      width: 170,
      height: 35,
      borderRadius: 10,
      borderColor: 'black',
      borderWidth: 1,
    },
    title: {
      fontSize: 18,
    },
    eventDescription: {
      fontSize: 16,
      paddingLeft: 2,
      paddingRight: 10,
      paddingTop: 5,
      marginRight: 10,
    },
    eventImage: {
      width: 'auto',
      height: 190,
      borderRadius: 25,
      marginBottom: 10,
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

    clearIcon: {
      marginLeft: 10,
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
          No events found
        </Text>
      </View>

      <View>
        <FooterNavbar currentRoute={''} />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>Events Created By me</Text>
      <View
        style={{
          marginHorizontal: 5,
          //  marginVertical: 5,
          marginTop: 10,
        }}>
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
          // inputContainerStyle={{ backgroundColor: backgroundColor }}
          inputStyle={{ color: textColor }}
        />
      </View>
      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'pdf417'],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <Button
              buttonStyle={{
                backgroundColor: 'black',
                borderRadius: 10,
                padding: 10,
                width: 200,
              }}
              title={'Tap to Scan Again'}
              onPress={() => setScanned(false)}
            />
          )}

          <Button
            onPress={async () => {
              setModalVisible(false)
            }}
            buttonStyle={{
              marginTop: 20,
              backgroundColor: 'white',
              padding: 10,
              width: 200,
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
          </Button>
        </View>
      </Modal>

      <Overlay
        animationType="slide"
        transparent={true}
        isVisible={isModalVisible}
        onBackdropPress={async () => {
          setIsModalVisible(!isModalVisible)
        }}
        overlayStyle={{ backgroundColor: 'transparent' }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text
                style={{
                  paddingTop: 4,
                  paddingLeft: 37,
                  fontSize: 24,
                  width: '100%',
                }}>
                {t('map.editEventDetails')}
              </Text>
              <Button
                buttonStyle={{
                  borderRadius: 50,
                  backgroundColor: backgroundColor,
                }}
                //  style={[styles.button, styles.buttonClose]}
                onPress={async () => {
                  setIsModalVisible(!isModalVisible)
                }}>
                <Icon name="close" size={26} color="white" />
              </Button>
            </View>
            <View
              style={{
                borderTopColor: 'black',
                borderTopWidth: 1,
                width: '100%',
              }}>
              <EditEventForm
                refreshSelectedMarkerData={fetchEvents}
                eventId={event?.id}
                eventName={event?.eventName}
                eventImage={event?.eventImage}
                latitude={event?.eventLocation.latitude}
                longitude={event?.eventLocation.longitude}
                eventDescription={event?.eventDescription}
                maxParticipants={event?.maxParticipants}
                otherRelevantInformation={
                  event?.otherRelevantInformation
                }></EditEventForm>
            </View>
          </View>
        </View>
      </Overlay>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => {
          setIsDeleteModalVisible(!isDeleteModalVisible)
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text
                style={{
                  paddingTop: 4,
                  paddingLeft: 37,
                  fontSize: 24,
                  width: '100%',
                }}>
                Are you sure you want to delete this event?
              </Text>
              <Button
                buttonStyle={{
                  backgroundColor: 'black',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}
                //   style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setIsDeleteModalVisible(!isDeleteModalVisible)
                }}>
                <Icon name="close" size={24} color="white" />
              </Button>
            </View>
            <ScrollView
              style={{
                borderTopColor: 'black',
                borderTopWidth: 1,
                width: '100%',
              }}>
              <View>
                <Text>Event details</Text>
                <Text>Event id:{event?.id}</Text>
                <Text>Event Name:{event?.eventName}</Text>
                <Text>Event Description:{event?.eventDescription}</Text>
                <Text>Event Max Participants:{event?.maxParticipants}</Text>
              </View>
              <Button
                buttonStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // marginHorizontal: 60,
                  backgroundColor: 'black',
                  borderRadius: 10,
                  marginTop: 20,
                }}
                onPress={() => {
                  deleteEvent(event?.id)
                }}>
                <Text
                  style={{
                    //  marginVertical: 10,
                    color: 'white',
                    fontSize: 24,
                  }}>
                  Delete
                </Text>
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

export default EventsCreatedByMe

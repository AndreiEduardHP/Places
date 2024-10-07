import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Marker } from 'react-native-maps'
import MapView from 'react-native-map-clustering'
import MapViewDirections from 'react-native-maps-directions'
import {
  View,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import BottomDrawer from '../BottomDrawer'
import EventForm from '../EventForm'
import { config } from '../../config/urlConfig'
import axios from 'axios'
import { useUser } from '../../Context/AuthContext'
import LoadingComponent from '../Loading/Loading'
import { useNotification } from '../Notification/NotificationProvider'
import UserLocationMarker from './UserLocationMarkerComponent'
import SavedMarker from './SavedMarkerComponent'
import EventDetails from './EventDetailsDrawer'
import {
  MapMarker,
  MapMarkerDetail,
  MapMarkerDetailConnection,
} from '../../Interfaces/IUserData'
import GooglePlacesInput from './GoogleAutocomplete'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../Navigation/Types'
import StepperHorizontal from '../../Screens/Stepper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { t } from 'i18next'
import SearchEvent from './SearchEvent'
import { getLocation } from '../../Services/CurrentLocation'
import { map } from '../../config/mapConfig'
import ConnectionMarker from './ConnectionMarker'

const CustomeMap: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<MapMarker | null>(null)
  const [markers, setMarkers] = useState<MapMarkerDetail[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerDetail | null>(
    null,
  )
  const [routeDistance, setRouteDistance] = useState<number | null>(null)
  const [routeDuration, setRouteDuration] = useState<number | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [addNewEvent, setAddNewEvent] = useState(false)
  const mapRef = useRef<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [addEventMarker, setAddEventMarker] = useState<MapMarker>()
  const [isMapReady, setIsMapReady] = useState(false)
  const [userHasJoined, setUserHasJoined] = useState(false)
  const [isInputEmpty, setIsInputEmpty] = useState(true)
  const [refreshParticipantsTrigger, setRefreshParticipantsTrigger] =
    useState(false)
  const [optionVisible, setOptionVisible] = useState(false)
  const { loggedUser } = useUser()
  const route = useRoute<RouteProp<RootStackParamList, 'MapScreen'>>()
  const [savedMarkers, setSavedMarkers] = useState<MapMarkerDetail[]>([])
  const [connectionMarkers, setConnectionMarkers] = useState<
    MapMarkerDetailConnection[]
  >([])
  const [isChecked, setChecked] = useState(false)
  const { showNotificationMessage } = useNotification()
  const [searchLocation, setSearchLocation] = useState<boolean>(true)
  const [searchEvent, setSearchEvent] = useState<boolean>(false)
  const [focusInput, setFocusInput] = useState(false)
  const savedMarkersMemoized = useMemo(() => savedMarkers, [savedMarkers])
  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(
    null,
  ) // State to control which marker should show callout
  const googlePlacesRef = useRef<any>(null)
  console.log(loggedUser?.role)
  useEffect(() => {
    fetchLocation()
  }, [])
  const fetchLocation = useCallback(async () => {
    const location = await getLocation()
    if (location) {
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        key: 'currentLocation',
      })
    }
  }, [])
  useEffect(() => {
    fetchEvents()
    fetchConnections()
  }, [selectedMarker])

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/Event`)

      const newMarkers: MapMarkerDetail[] = response.data.map((res: any) => ({
        latitude: res.locationLatitude,
        longitude: res.locationLongitude,
        key: res.id.toString(),
        eventName: res.eventName,
        eventDescription: res.eventDescription,
        eventImage: res.eventImage,
        maxParticipants: res.maxParticipants,
        createdByUserId: res.createdByUserId,
        otherRelevantInformation: res.otherRelevantInformation,
        imageAlbumUrls: res.eventAlbumImages.map(
          (image: any) => image.imageUrl,
        ),
      }))

      setSavedMarkers(newMarkers)
      console.log(savedMarkers)
      setMarkers([])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/Friend/acceptedFriendRequests/${loggedUser?.id}`,
      )

      const newMarkers: MapMarkerDetailConnection[] = response.data.map(
        (res: any) => ({
          latitude: res.latitude,
          longitude: res.longitude,
          key: res.requestId.toString(),
          senderName: res.senderName,
          senderPicture: res.senderPicture,
          profile: res.profile,
          status: res.status,
        }),
      )
      setConnectionMarkers(newMarkers)

      // setMarkers([])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (
      isMapReady &&
      mapRef.current &&
      isLoading === false &&
      route.params?.latitude &&
      route.params?.longitude
    ) {
      const targetLatitude = route.params.latitude
      const targetLongitude = route.params.longitude

      mapRef.current.animateToRegion({
        latitude: targetLatitude,
        longitude: targetLongitude,
        latitudeDelta: 0.11,
        longitudeDelta: 0.11,
      })
    } else if (
      isMapReady &&
      currentLocation &&
      mapRef.current &&
      isLoading === false &&
      !route.params?.latitude &&
      !route.params?.longitude
    ) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.25,
        longitudeDelta: 0.25,
      })
    }
  }, [
    currentLocation,
    isMapReady,
    isLoading,
    route.params?.latitude,
    route.params?.longitude,
  ])

  const handleMapPress = async (e: any) => {
    const isExistingMarker = markers.some(
      (marker) =>
        marker.latitude === e.nativeEvent.coordinate.latitude &&
        marker.longitude === e.nativeEvent.coordinate.longitude,
    )
    const isExistingHardcodedMarker = savedMarkers.some(
      (savedMarkers) =>
        savedMarkers.latitude === e.nativeEvent.coordinate.latitude &&
        savedMarkers.longitude === e.nativeEvent.coordinate.longitude,
    )

    if (isExistingMarker || isExistingHardcodedMarker) {
      return
    }

    if (
      currentLocation &&
      e.nativeEvent.coordinate.latitude === currentLocation.latitude &&
      e.nativeEvent.coordinate.longitude === currentLocation.longitude
    ) {
      // Don't add a marker if the pressed location is the current location
      return
    }
    setAddNewEvent(true)
    const newMarker = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      key:
        e.nativeEvent.coordinate.latitude + e.nativeEvent.coordinate.longitude,
    }
    await setAddEventMarker(newMarker)

    setMarkers((currentMarkers: any) => [...currentMarkers, newMarker])
  }

  const handleInputChange = (isEmpty: boolean) => {
    setIsInputEmpty(isEmpty)
  }
  const handleMarkerPress = (marker: MapMarkerDetail) => {
    setSelectedMarker(marker)
    setSelectedMarkerKey(marker.key)
    //  setDrawerVisible(true)
    //  userHasJoinedEvent(marker.key, loggedUser?.id)
  }
  const handleCalloutPress = (marker: MapMarkerDetail) => {
    setSelectedMarker(marker)
    setDrawerVisible(true)
    userHasJoinedEvent(marker.key, loggedUser?.id)
  }

  const deselectRoute = () => {
    setSelectedMarker(null)
  }

  const refreshParticipants = () => {
    setRefreshParticipantsTrigger((prev) => !prev)
  }

  const handleJoinEvent = async () => {
    const apiUrl = `${config.BASE_URL}/api/userprofileevent/joinevent`
    const requestBody = {
      EventId: selectedMarker?.key,
      UserProfileId: loggedUser?.id,
      HideUserInParticipantsList: isChecked,
      UserChecked: false,
    }

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {},
      })

      showNotificationMessage('Joined event successfully', 'success')
      refreshParticipants()
      userHasJoinedEvent(selectedMarker?.key, loggedUser?.id)
    } catch (error) {
      console.error(error)
    }
  }
  const handleUnJoinEvent = async () => {
    const apiUrl = `${config.BASE_URL}/api/userprofileevent/unjoinevent?eventId=${selectedMarker?.key}&userId=${loggedUser?.id}`

    try {
      const response = await axios.post(apiUrl)

      if (response.status === 200) {
        showNotificationMessage('Unjoined event successfully', 'success')
        refreshParticipants()
        userHasJoinedEvent(selectedMarker?.key, loggedUser?.id)
      } else {
        showNotificationMessage('Failed to unjoin event', 'fail')
      }
    } catch (error) {
      showNotificationMessage('An unexpected error occurred', 'fail')
    }
  }

  const userHasJoinedEvent = async (eventId: any, userId: any) => {
    try {
      const apiUrl = `${config.BASE_URL}/api/userprofileevent/checkIfUserJoined`
      const params = {
        eventId: eventId,
        userId: userId,
      }

      const response = await axios.get(apiUrl, { params })

      setUserHasJoined(response.data)
    } catch (error) {
      console.error(
        'An error occurred while checking if the user joined the event:',
        error,
      )
      throw error
    }
  }

  const openGoogleMaps = () => {
    if (selectedMarker && currentLocation) {
      const origin = `${currentLocation.latitude},${currentLocation.longitude}`
      const destination = `${selectedMarker.latitude},${selectedMarker.longitude}`
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
      Linking.openURL(url)
    }
  }

  const refreshSelectedMarkerData = (updatedEvent: MapMarkerDetail) => {
    setSelectedMarker(updatedEvent)
  }
  const handleNewLocationSelected = async (location: any) => {
    const newMarker = {
      latitude: location.latitude,
      longitude: location.longitude,
      key: `${location.latitude},${location.longitude}`,
      title: location.title,
    }
    // setAddNewEvent(true)
    await setAddEventMarker(newMarker)
    setOptionVisible(true)
    // setMarkers(
    //   (currentMarkers) => [...currentMarkers, newMarker] as MapMarkerDetail[],
    // )

    /* if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      )
    }*/
  }
  const handleAddEvent = (location: MapMarker | null) => {
    if (!location) return
    const newMarker: MapMarker = {
      latitude: location.latitude,
      longitude: location.longitude,
      key: `${location.latitude}-${location.longitude}`,
    }
    setAddNewEvent(true)

    setAddEventMarker(newMarker)
    setMarkers(
      (currentMarkers) => [...currentMarkers, newMarker] as MapMarkerDetail[],
    )
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      )
    }
  }
  const navigateToLocation = (location: MapMarker | null) => {
    if (!location) return
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.1,
        },
        1000,
      )
    }
  }
  const handleOptionSelect = (option: 'add' | 'navigate') => {
    //  setOptionVisible(false)
    if (addEventMarker) {
      if (option === 'add') {
        handleAddEvent(addEventMarker)
      } else if (option === 'navigate') {
        navigateToLocation(addEventMarker)
      }
    }
  }
  const handleMarkerDragEnd = async (marker: MapMarkerDetail, e: any) => {
    const newMarker = {
      ...marker,
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    }

    setMarkers((prevMarkers) =>
      prevMarkers.map((m) => (m.key === marker.key ? newMarker : m)),
    )
    // Save the new coordinates to your server here
    await saveMarkerCoordinates(newMarker)
    fetchEvents()
  }
  const saveMarkerCoordinates = async (marker: MapMarkerDetail) => {
    try {
      await axios.put(`${config.BASE_URL}/api/Event/${marker.key}`, {
        latitude: marker.latitude,
        longitude: marker.longitude,
      })
      showNotificationMessage('Coordinates updated successfully', 'success')
    } catch (error) {
      console.error('Error updating coordinates:', error)
      showNotificationMessage('Failed to update coordinates', 'fail')
    }
  }
  const handleEventSelect = (event: {
    locationLatitude: any
    locationLongitude: any
    maxParticipants: any
    createdByUserId: any
    eventName: any
    eventImage: any
    eventDescription: any
    otherRelevantInformation: any
    id: { toString: () => any }
  }) => {
    const selectedLocation = {
      latitude: event.locationLatitude,
      longitude: event.locationLongitude,
      key: event.id.toString(),
      eventName: event.eventName,
      eventImage: event.eventImage,
      eventDescription: event.eventDescription,
      otherRelevantInformation: event.otherRelevantInformation,
      maxParticipants: event.maxParticipants,
      createdByUserId: event.createdByUserId,
    }

    setSearchEvent(false)
    //   setSearchEvent(false)

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.0011,
          longitudeDelta: 0.0011,
        },
        1000,
      )
    }
    handleMarkerPress(selectedLocation)
  }
  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? undefined : 'height'}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          googleRenderer={'LEGACY'}
          initialRegion={{
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsTraffic={true}
          userInterfaceStyle={
            loggedUser?.themeColor === 'dark' ? 'dark' : 'light'
          }
          onLongPress={handleMapPress}
          onPress={() => {
            Keyboard.dismiss()
          }}
          onMapReady={() => setIsMapReady(true)}>
          {markers.map((marker, index) => (
            <Marker
              key={`marker-${marker.key}-${index}`}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              draggable={true}
              onDragEnd={(e) => handleMarkerDragEnd(marker, e)}
              title={marker.eventName}
              description={`${t('map.description')}: ${marker.latitude} ${marker.longitude}`}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
          {currentLocation && (
            <UserLocationMarker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}></UserLocationMarker>
          )}
          {savedMarkersMemoized.map((marker, index) => (
            <SavedMarker
              key={`savedMarker-${marker.key}-${index}`}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              draggable={marker.createdByUserId === loggedUser?.id}
              onDragEnd={(e) => handleMarkerDragEnd(marker, e)}
              title={marker.eventName}
              description={`${t('map.description')}: ${marker.eventDescription}`}
              eventName={marker.eventName}
              eventDescription={marker.eventDescription}
              createdByUserId={marker.createdByUserId}
              onPress={() => handleMarkerPress(marker)}
              onPressCallOut={() => handleCalloutPress(marker)}
              eventImage={marker.eventImage}
              showCallout={selectedMarker?.key === marker.key}
              deselectRoute={deselectRoute}
            />
          ))}
          {connectionMarkers.map((marker, index) => (
            <ConnectionMarker
              key={`connectionMarker-${marker.requestId}-${index}`}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              draggable={true}
              title={marker.senderName}
              description={`${t('Nume')}: ${marker.senderName}`}
              latitude={marker.latitude}
              longitude={marker.longitude}
              senderName={marker.senderName}
              senderPicture={marker.senderPicture}
              personData={{
                friendRequestStatus: marker.status,
                areFriends: true,
                id: marker.profile.id,
                username: marker.profile.username,
                firstName: marker.profile.firstName,
                lastName: marker.profile.lastName,
                phoneNumber: marker.profile.phoneNumber,
                description: marker.profile.description,
                email: marker.profile.email,
                interest: marker.profile.interest,
                profilePicture: marker.senderPicture,
                city: marker.profile.city,
                currentLocationId: 0,
                notificationToken: marker.profile.notificationToken,
              }}
              status={marker.status}
            />
          ))}

          {currentLocation && selectedMarker && (
            <MapViewDirections
              origin={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              destination={{
                latitude: selectedMarker.latitude,
                longitude: selectedMarker.longitude,
              }}
              apikey={map.key}
              strokeWidth={3}
              strokeColor="#00B0EF"
              onReady={(result) => {
                setRouteDistance(result.distance)
                setRouteDuration(result.duration)
              }}
            />
          )}
        </MapView>
        {searchLocation && (
          <View
            style={{
              position: 'absolute',
              width: '98%',
              left: '1%',
              zIndex: 2,
              backgroundColor: 'white',
              shadowColor: 'black',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 4,
              padding: 1,
              borderRadius: 8,
              top: '1%',
            }}>
            <GooglePlacesInput
              ref={googlePlacesRef}
              onLocationSelected={handleNewLocationSelected}
              onInputChange={handleInputChange}
              userCurrentLatitude={currentLocation?.latitude ?? 0}
              userCurrentLongitude={currentLocation?.longitude ?? 0}
            />
          </View>
        )}
        {optionVisible && isInputEmpty && (
          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={() => handleOptionSelect('add')}>
              <Text style={{ color: 'white' }}>{t('labels.addEvent')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect('navigate')}>
              <Text style={{ color: 'white' }}>
                {t('labels.navigateToLocation')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {searchEvent && (
          <View
            style={{
              position: 'absolute',
              width: '98%',
              left: '1%',
              zIndex: 2,
              backgroundColor: 'white',
              shadowColor: 'black',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 4,
              padding: 1,
              borderRadius: 8,
              top: '1%',
            }}>
            <SearchEvent
              focusInput={focusInput}
              onEventSelect={handleEventSelect}
            />
          </View>
        )}

        <View
          style={{
            position: 'absolute',
            width: 'auto',
            right: '3%',
            shadowColor: 'black',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 4,
            bottom: '8%',
          }}>
          <TouchableOpacity
            style={{
              paddingTop: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              mapRef.current.animateToRegion(
                {
                  latitude: currentLocation?.latitude,
                  longitude: currentLocation?.longitude,
                  latitudeDelta: 0.03,
                  longitudeDelta: 0.03,
                },
                1000,
              )
            }}>
            <Icon name="explore" size={70} color={'#00B0EF'}></Icon>
          </TouchableOpacity>
        </View>
        {loggedUser?.role !== 'agency' && (
          <View
            style={{
              position: 'absolute',
              width: 'auto',
              left: '3%',
              shadowColor: 'black',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,

              elevation: 4,
              bottom: '8%',
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setSearchLocation(false)
                setSearchEvent(true)
                setFocusInput(true)
              }}>
              <Image
                source={require('../../../assets/Icons/search.png')}
                style={{ width: 40, height: 40, tintColor: '#00B0EF' }}
              />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            width: 'auto',
            left: '3%',
            shadowColor: 'black',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
            bottom: loggedUser?.role !== 'agency' ? '14%' : '8%',
          }}>
          <TouchableOpacity
            style={{
              paddingTop: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setSearchLocation(true)
              setSearchEvent(false)
              googlePlacesRef.current?.focusInput()
            }}>
            <Image
              source={require('../../../assets/Icons/plus (1).png')}
              style={{ width: 40, height: 40, tintColor: '#00B0EF' }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <BottomDrawer
        title={t('bottomDrawer.eventDetails')}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false)
          deselectRoute()
          Keyboard.dismiss()
          setSelectedMarker(null)
        }}>
        {
          //userHasJoined ||
          // selectedMarker?.createdByUserId === loggedUser?.id) &&

          selectedMarker && (
            //   ? (
            <EventDetails
              refreshSelectedMarkerData={refreshSelectedMarkerData}
              selectedMarker={selectedMarker}
              createdByUserId={selectedMarker?.createdByUserId}
              drawerVisible={drawerVisible}
              isChecked={isChecked}
              setChecked={setChecked}
              userHasJoined={userHasJoined}
              handleUnJoinEvent={handleUnJoinEvent}
              handleJoinEvent={handleJoinEvent}
              routeDistance={routeDistance}
              routeDuration={routeDuration}
              openGoogleMaps={openGoogleMaps}
              markers={markers}
              refreshParticipantsTrigger={refreshParticipantsTrigger}
            />
          )
        }
        {/*    : (
          selectedMarker && (
            <StepperHorizontal
              refreshSelectedMarkerData={refreshSelectedMarkerData}
              selectedMarker={selectedMarker}
              createdByUserId={selectedMarker?.createdByUserId}
              drawerVisible={drawerVisible}
              isChecked={isChecked}
              setChecked={setChecked}
              userHasJoined={userHasJoined}
              handleUnJoinEvent={handleUnJoinEvent}
              handleJoinEvent={handleJoinEvent}
              routeDistance={routeDistance}
              routeDuration={routeDuration}
              openGoogleMaps={openGoogleMaps}
              markers={markers}
              refreshParticipantsTrigger={refreshParticipantsTrigger}
            />
          )
       )}
      */}
      </BottomDrawer>

      <BottomDrawer
        title={t('labels.addNewEvent')}
        visible={addNewEvent}
        onClose={() => {
          setAddNewEvent(false)
          deselectRoute()
          setMarkers(markers.slice(0, -1))
          Keyboard.dismiss()
        }}>
        <EventForm
          key={`${addEventMarker?.latitude}-${addEventMarker?.longitude}`}
          latitude={addEventMarker?.latitude}
          longitude={addEventMarker?.longitude}
          onEventAdded={fetchEvents}
          setAddNewEvent={setAddNewEvent}></EventForm>
      </BottomDrawer>
    </>
  )
}
const styles = StyleSheet.create({
  optionContainer: {
    position: 'absolute',
    top: '6%',
    left: '1%',
    right: '1%',
    zIndex: 0,
    backgroundColor: '#00B0EF',
    padding: 13,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#00B0EF',
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
  },
})

export default CustomeMap

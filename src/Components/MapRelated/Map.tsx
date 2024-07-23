import React, { useEffect, useRef, useState } from 'react'
import { Marker } from 'react-native-maps'
import MapView from 'react-native-map-clustering'
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'
import {
  View,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TextInput,
  Text,
  Button,
  FlatList,
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
import { MapMarker, MapMarkerDetail } from '../../Interfaces/IUserData'
import GooglePlacesInput from './GoogleAutocomplete'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../Navigation/Types'
import Stepper from 'react-native-stepper-ui'
import StepperHorizontal from '../../Screens/Stepper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { t } from 'i18next'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'

const CustomeMap: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<MapMarker | null>(null)
  const [markers, setMarkers] = useState<MapMarkerDetail[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerDetail | null>(
    null,
  )
  const apiKey = 'AIzaSyAjpd8EvSYVtI-6tta5IXQYaIJp5PdCS8I'
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
  const [isChecked, setChecked] = useState(false)
  const { showNotificationMessage } = useNotification()
  const { backgroundColor } = useThemeColor()

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('Permission to access location was denied')
        return
      }

      let location = await await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      if (location) {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          key: 'currentLocation',
        })
      }
    } catch (error) {
      console.error('Error getting current location:', error)
    }
  }
  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [selectedMarker])

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/Event`)

      // Transform eventData into savedMarkers
      const newMarkers: MapMarkerDetail[] = response.data.map((res: any) => ({
        latitude: res.locationLatitude,
        longitude: res.locationLongitude,
        key: res.id.toString(),
        eventName: res.eventName,
        eventDescription: res.eventDescription,
        eventImage: res.eventImage,
        maxParticipants: res.maxParticipants,
        createdByUserId: res.createdByUserId,
      }))

      setSavedMarkers(newMarkers)
      setMarkers([])
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
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
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
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
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
    // Check if there is already a marker at the pressed coordinates

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
      // Don't add a marker if there is already one at the pressed coordinates
      return
    }

    // Check if the pressed location matches the current location
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

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
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
        onPress={() => Keyboard.dismiss()}
        onMapReady={() => setIsMapReady(true)}>
        {markers.map((marker) => (
          <Marker
            key={marker.key}
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
        {savedMarkers.map((marker) => (
          <SavedMarker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            draggable={true}
            onDragEnd={(e) => handleMarkerDragEnd(marker, e)}
            title={marker.eventName}
            description={`${t('map.description')}: ${marker.eventDescription}`}
            eventName={marker.eventName}
            eventDescription={marker.eventDescription}
            createdByUserId={marker.createdByUserId}
            onPress={() => handleMarkerPress(marker)}
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
            apikey={apiKey}
            strokeWidth={3}
            strokeColor="#00B0EF"
            onReady={(result) => {
              setRouteDistance(result.distance)
              setRouteDuration(result.duration)
            }}
          />
        )}
      </MapView>
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
          onLocationSelected={handleNewLocationSelected}
          onInputChange={handleInputChange}
          userCurrentLatitude={currentLocation?.latitude ?? 0}
          userCurrentLongitude={currentLocation?.longitude ?? 0}
        />
      </View>
      {optionVisible && isInputEmpty && (
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => handleOptionSelect('add')}>
            <Text style={{ color: 'white' }}>Add Event</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('navigate')}>
            <Text style={{ color: 'white' }}>Navigate to Location</Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          width: 'auto',
          right: '3%',
          shadowColor: 'black',
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.5,
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

      <BottomDrawer
        title={t('bottomDrawer.eventDetails')}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false)
          deselectRoute()
          Keyboard.dismiss()
        }}>
        {(userHasJoined ||
          selectedMarker?.createdByUserId === loggedUser?.id) &&
        selectedMarker ? (
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
        ) : (
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
      </BottomDrawer>

      <BottomDrawer
        title="Add new event"
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

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
import { mapCustomStyle } from './MapStyle'

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
  const mapRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [addEventMarker, setAddEventMarker] = useState<MapMarker>()
  const [isMapReady, setIsMapReady] = useState(false)
  const [userHasJoined, setUserHasJoined] = useState(false)
  const [refreshParticipantsTrigger, setRefreshParticipantsTrigger] =
    useState(false)

  const { loggedUser } = useUser()

  const [region] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [savedMarkers, setSavedMarkers] = useState<MapMarkerDetail[]>([])
  const [isChecked, setChecked] = useState(false)
  const { showNotificationMessage } = useNotification()

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
      currentLocation &&
      mapRef.current &&
      isLoading === false
    ) {
      setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        })
      }, 500)
    }
  }, [currentLocation, isMapReady, isLoading])

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      if (location) {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,

          key: 'currentLocation',
        })
      }
    })()
  }, [])

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

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        showsTraffic={true}
        userInterfaceStyle={
          loggedUser?.themeColor === 'dark' ? 'dark' : 'light'
        }
        onLongPress={handleMapPress}
        onMapReady={() => setIsMapReady(true)}>
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            draggable={true}
            onDragEnd={(e) => {
              const newMarker = {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                key: `${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}`,
              }
              setAddEventMarker(newMarker)
            }}
            title="title"
            description={`Description: ${marker.latitude} ${marker.longitude}`}
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
            strokeWidth={5}
            strokeColor="blue"
            onReady={(result) => {
              setRouteDistance(result.distance)
              setRouteDuration(result.duration)
            }}
          />
        )}
      </MapView>
      <BottomDrawer
        title="Event Details"
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false)
          deselectRoute()
          Keyboard.dismiss()
        }}>
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
    </View>
  )
}

export default CustomeMap

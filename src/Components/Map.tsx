import React, { useEffect, useRef, useState } from 'react'
import { Marker } from 'react-native-maps'
import MapView from 'react-native-map-clustering'
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'
import {
  View,
  Text,
  Dimensions,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Animated,
  Linking,
  Alert,
} from 'react-native'
import { TapGestureHandler } from 'react-native-gesture-handler'
import BottomDrawer from './BottomDrawer'
import EventForm from '../Components/EventForm'
import { config } from '../config/urlConfig'
import axios from 'axios'
import { ImageConfig } from '../config/imageConfig'
import { useUser } from '../Context/AuthContext'
import ParticipantsListContainer from './EventParticipants'
import LoadingComponent from '../Components/Loading/Loading'

type MapMarkerDetail = {
  latitude: number
  longitude: number
  key: string
  eventDescription?: string
  eventName?: string
  eventImage?: string
}
type MapMarker = {
  latitude: number
  longitude: number
  key: string
}
const screenHeight = Dimensions.get('window').height

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
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [refreshParticipantsTrigger, setRefreshParticipantsTrigger] =
    useState(false)

  const { loggedUser } = useUser()

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [savedMarkers, setSavedMarkers] = useState<MapMarkerDetail[]>([])

  useEffect(() => {
    fetchEvents()
  }, [refreshTrigger])

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
        eventImage: res.eventImage, // Assuming there's an id field in the eventData
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
        e.nativeEvent.coordinate.latitude + e.nativeEvent.coordinate.longitude, // A unique key for each marker
    }
    await setAddEventMarker(newMarker)

    setMarkers((currentMarkers) => [...currentMarkers, newMarker])
  }

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(currentLocation, 1000)
    }
  }, [currentLocation])

  const handleMarkerPress = (marker: MapMarkerDetail) => {
    setSelectedMarker(marker)
    // console.log(marker.key)
    setDrawerVisible(true)
  }

  const deselectRoute = () => {
    setSelectedMarker(null)
  }

  // Function to toggle the refresh trigger
  const refreshParticipants = () => {
    setRefreshParticipantsTrigger((prev) => !prev)
  }

  const handleJoinEvent = async () => {
    const apiUrl = `${config.BASE_URL}/api/userprofileevent/joinevent` // Ensure your config.BASE_URL is correct
    const requestBody = {
      EventId: selectedMarker?.key, // Ensure selectedMarker and loggedUser are defined and have the expected properties
      UserProfileId: loggedUser?.id,
    }

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {},
      })

      Alert.alert('Success', 'Joined event successfully')
      refreshParticipants()
    } catch (error) {
      console.error(error)
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
  if (isLoading) {
    // Display the loading component while isLoading is true
    return <LoadingComponent />
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        onLongPress={handleMapPress}>
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            draggable={true} // Adaugă această linie pentru a face markerul draggable
            onDragEnd={(e) => {
              console.log('New marker coordinates:', e.nativeEvent.coordinate)
              const newMarker = {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                key: `${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}`, // A unique key for each marker
              }
              setAddEventMarker(newMarker)
            }}
            title="title"
            description={`Description: ${marker.latitude} ${marker.longitude}`}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
        {currentLocation && (
          <Marker
            key={currentLocation.key}
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="My Location"
            pinColor="blue"
            draggable={true} // Enable marker dragging
            onDragStart={() => console.log('Drag started')} // Function called when drag starts
            onDrag={() => console.log('Dragging')} // Function called while dragging
            onDragEnd={(e) => console.log('Drag end', e.nativeEvent.coordinate)} // Function called when drag ends
          >
            <Image
              source={require('../../assets/Icons/r2.png')} // Adjust the path to your custom marker image
              style={{ width: 22, height: 35 }} // Adjust the width and height of the marker image
            />
          </Marker>
        )}
        {savedMarkers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={`Event: ${marker.eventName}`}
            description={`Description: ${marker.eventDescription}`}
            pinColor="pink"
            onPress={() => handleMarkerPress(marker)}>
            <Image
              source={require('../../assets/Icons/pin.gif')} // Adjust the path to your custom marker image
              style={{ width: 25, height: 35, borderRadius: 10 }} // Adjust the width and height of the marker image
            />
          </Marker>
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
              setRouteDuration(result.duration) // Set the distance in the state
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
        }}>
        <View
          style={{
            borderTopColor: 'rgba(0,0,0,0.6)',
            borderTopWidth: 1,
            borderRadius: 5,
          }}>
          <View>
            <View style={{}}>
              <Text style={[styles.title, {}]}>
                {' '}
                {selectedMarker?.eventName}
              </Text>
              {selectedMarker ? (
                <ParticipantsListContainer
                  eventId={Number(selectedMarker?.key)}
                  shouldRefreshParticipants={refreshParticipantsTrigger}
                />
              ) : (
                <Text>idk</Text>
              )}
            </View>

            <View style={{ flexDirection: 'row-reverse', margin: 5 }}>
              <Image
                style={{ width: 28, height: 28, marginLeft: 10 }}
                source={require('../../assets/Icons/quote (1).png')} // Replace with the path to your image
              />
              <Text style={styles.eventDescription}>
                {' '}
                {selectedMarker?.eventDescription}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 5,
            }}>
            <Image
              style={styles.eventImage}
              source={
                selectedMarker && selectedMarker.eventImage
                  ? {
                      uri: ImageConfig.IMAGE_CONFIG + selectedMarker.eventImage,
                    }
                  : require('../../assets/party.jpg')
              } // Replace with the path to your image
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={handleJoinEvent}>
              <Text style={styles.joinEvent}>Join Event</Text>
            </TouchableOpacity>
          </View>
        </View>
        {selectedMarker ? (
          <View
            style={{
              borderTopColor: 'rgba(0,0,0,0.6)',
              borderTopWidth: 1,
              borderRadius: 5,
            }}>
            <View style={styles.traficInfoContainer}>
              <View>
                {routeDistance && routeDuration ? (
                  <View style={{ flexDirection: 'column' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 18, fontWeight: '500' }}>
                        Route Distance:
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                        }}>
                        {' '}
                        {routeDistance.toFixed(2)} km
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontSize: 18, fontWeight: '500' }}>
                        Estimated Time With Car:
                      </Text>
                      <Text style={{ fontSize: 17 }}>
                        {' '}
                        {routeDuration.toFixed(1)} min
                      </Text>
                    </View>
                  </View>
                ) : (
                  ''
                )}
              </View>

              {markers ? (
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={[styles.closeTraficInfo, { marginLeft: 20 }]}
                    onPress={() => openGoogleMaps()}>
                    <Text>Open in Google Maps</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                ''
              )}
            </View>
          </View>
        ) : (
          ''
        )}
      </BottomDrawer>
      <BottomDrawer
        title="Add new event"
        visible={addNewEvent}
        onClose={() => {
          setAddNewEvent(false)
          deselectRoute()
          setMarkers(markers.slice(0, -1))
        }}>
        <EventForm
          key={`${addEventMarker?.latitude}-${addEventMarker?.longitude}`}
          latitude={addEventMarker?.latitude}
          longitude={addEventMarker?.longitude}
          onEventAdded={fetchEvents} // Pass the callback function
          setAddNewEvent={setAddNewEvent}></EventForm>
      </BottomDrawer>
    </View>
  )
}

const styles = StyleSheet.create({
  traficInfoContainer: {
    alignItems: 'center',
    padding: 10,

    marginHorizontal: 5,
    marginBottom: 5,
  },
  closeTraficInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: 150,
    height: 35,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
  },
  eventDescription: {
    fontSize: 16,
    paddingLeft: 2,
    paddingRight: 10,
    paddingTop: 5,
    marginRight: 10,
  },
  eventImage: {
    width: '100%',
    height: 190,
    borderRadius: 25,
  },
  joinEvent: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  participants: {
    fontSize: 14,
    alignItems: 'center',

    justifyContent: 'center',
    padding: 8,
  },
})

export default CustomeMap
